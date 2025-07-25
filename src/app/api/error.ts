import { NextResponse } from "next/server";
import { CustomError } from "@/lib/database/errors/custom-error";

export function handleApiError(err: unknown) {
  if (err instanceof CustomError) {
    return new NextResponse(JSON.stringify({ errors: err.serializeErrors() }), {
      status: err.statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }

  process.env.NODE_ENV === "development" &&
    console.error("Unhandled error:", err);

  return new NextResponse(
    JSON.stringify({ errors: [{ message: "Something went wrong" }] }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
