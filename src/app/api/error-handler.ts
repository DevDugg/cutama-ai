import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "./error";

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (err) {
      return handleApiError(err);
    }
  };
}
