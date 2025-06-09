import { atlasServerClient } from "@/lib/atlas-server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return atlasServerClient.handleRequest(request, slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return atlasServerClient.handleRequest(request, slug);
} 