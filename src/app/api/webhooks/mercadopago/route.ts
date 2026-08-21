import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentStatus } from "@/lib/mercadopago";

// O Mercado Pago chama esta URL sempre que o status de um pagamento muda.
// Configuramos notification_url para cá na hora de criar o Pix
// (veja src/lib/mercadopago.ts).
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // O Mercado Pago manda o id do pagamento em formatos um pouco diferentes
    // dependendo da versão do webhook — cobrimos os dois mais comuns.
    const paymentId = body?.data?.id || body?.id;
    const type = body?.type || body?.topic;

    if (!paymentId || (type && type !== "payment")) {
      return NextResponse.json({ received: true });
    }

    const { status, externalReference } = await getPaymentStatus(String(paymentId));

    if (!externalReference) {
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();

    if (status === "approved") {
      await admin
        .from("orders")
        .update({ payment_status: "aprovado", status: "pago" })
        .eq("id", externalReference);
    } else if (status === "rejected" || status === "cancelled") {
      await admin
        .from("orders")
        .update({ payment_status: "recusado" })
        .eq("id", externalReference);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // Responde 200 mesmo em erro para o Mercado Pago não ficar reenviando
    // indefinidamente; o erro fica só no log do servidor.
    console.error("[webhook mercadopago] erro:", err);
    return NextResponse.json({ received: true });
  }
}
