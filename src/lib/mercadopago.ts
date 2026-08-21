const MP_BASE_URL = "https://api.mercadopago.com/v1/payments";

/**
 * Cria uma cobrança Pix no Mercado Pago para um pedido.
 * Retorna o id do pagamento, o "copia e cola" e a imagem do QR Code (base64).
 *
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/payment-methods/pix
 */
export async function createPixPayment({
  orderId,
  amount,
  payerEmail,
  payerName,
  description,
}: {
  orderId: string;
  amount: number;
  payerEmail: string;
  payerName?: string;
  description: string;
}) {
  const res = await fetch(MP_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      // Evita cobrança duplicada em caso de retry de rede
      "X-Idempotency-Key": orderId,
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description,
      payment_method_id: "pix",
      external_reference: orderId,
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
      payer: {
        email: payerEmail,
        first_name: payerName || "Torcedor",
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Erro ao criar cobrança Pix no Mercado Pago");
  }

  return {
    paymentId: String(data.id),
    status: data.status as string,
    qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64 as string,
    copyPaste: data.point_of_interaction?.transaction_data?.qr_code as string,
    expiresAt: data.date_of_expiration as string | null,
  };
}

/** Consulta o status atual de um pagamento no Mercado Pago. */
export async function getPaymentStatus(paymentId: string) {
  const res = await fetch(`${MP_BASE_URL}/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Erro ao consultar pagamento no Mercado Pago");
  }

  return {
    status: data.status as string, // 'approved' | 'pending' | 'rejected' | 'cancelled' | ...
    externalReference: data.external_reference as string | null,
  };
}
