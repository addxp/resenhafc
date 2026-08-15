import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Endpoint chamado pelo Supabase após confirmação de e-mail / login via link mágico
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
