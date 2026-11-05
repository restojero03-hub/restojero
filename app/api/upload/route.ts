import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/content/upload-rules";

// Hands the dashboard a short-lived token so a photo can go straight to the image store.
// The token itself enforces the file type and size limits.
export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;
  if (body.type !== "blob.generate-client-token") {
    return NextResponse.json({ error: "Not supported" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_IMAGE_TYPES,
        maximumSizeInBytes: MAX_IMAGE_BYTES,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload token failed", error);
    return NextResponse.json({ error: "The upload didn't start" }, { status: 500 });
  }
}
