import { NextRequest } from "next/server";
import { CustomError } from "@/lib/database/errors/custom-error";

type ApiHandler = (req: NextRequest) => Promise<Response>;

interface ErrorHandlerOptions {
  isDevelopment?: boolean;
}

export function withErrorHandler(
  handler: ApiHandler,
  options: ErrorHandlerOptions = {
    isDevelopment: process.env.NODE_ENV === "development",
  }
): ApiHandler {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (err) {
      if (err instanceof CustomError) {
        return new Response(JSON.stringify({ errors: err.serializeErrors() }), {
          status: err.statusCode,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (options.isDevelopment) {
        console.error("Unhandled error:", err);
      }

      return new Response(
        JSON.stringify({ errors: [{ message: "Something went wrong" }] }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}
