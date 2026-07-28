import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Invalid contract ID" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("contracts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Contract not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Invalid contract ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const signatureImage = body.signature_image;

    if (
      typeof signatureImage !== "string" ||
      !signatureImage.startsWith("data:image/png;base64,")
    ) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const { data: contract, error: contractError } =
      await supabaseAdmin
        .from("contracts")
        .select("id, status")
        .eq("id", id)
        .single();

    if (contractError || !contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    if (
      contract.status === "signed" ||
      contract.status === "completed"
    ) {
      return NextResponse.json(
        { error: "Contract already signed" },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("contracts")
      .update({
        status: "signed",
        signature_image: signatureImage,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to sign contract" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}