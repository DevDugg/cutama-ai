import { NotFoundError } from "@/lib/database/errors/not-found-error";
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "../error-handler";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) {
    throw new NotFoundError();
  }
  return NextResponse.json({ message: "File uploaded successfully" });
});
