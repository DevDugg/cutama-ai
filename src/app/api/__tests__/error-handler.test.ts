import { NextRequest } from "next/server";
import { withErrorHandler } from "../error-handler";
import { BadRequestError } from "@/lib/database/errors/bad-request-error";
import { NotFoundError } from "@/lib/database/errors/not-found-error";
import { ModelError } from "@/lib/database/errors/model-error";

describe("withErrorHandler", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  const createRequest = () => {
    return new NextRequest(new URL("http://localhost"));
  };

  it("should pass through successful responses", async () => {
    const handler = withErrorHandler(async () => {
      return new Response(JSON.stringify({ data: "success" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const response = await handler(createRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ data: "success" });
  });

  it("should handle BadRequestError correctly", async () => {
    const errorMessage = "Invalid input";
    const handler = withErrorHandler(async () => {
      throw new BadRequestError(errorMessage);
    });

    const response = await handler(createRequest());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      errors: [{ message: errorMessage }],
    });
  });

  it("should handle NotFoundError correctly", async () => {
    const handler = withErrorHandler(async () => {
      throw new NotFoundError();
    });

    const response = await handler(createRequest());
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      errors: [{ message: "Not Found" }],
    });
  });

  it("should handle ModelError correctly", async () => {
    const errorMessage = "Database error";
    const handler = withErrorHandler(async () => {
      throw new ModelError(errorMessage);
    });

    const response = await handler(createRequest());
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      errors: [{ message: errorMessage }],
    });
  });

  it("should handle unknown errors with 500 status", async () => {
    const handler = withErrorHandler(async () => {
      throw new Error("Unknown error");
    });

    const response = await handler(createRequest());
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      errors: [{ message: "Something went wrong" }],
    });
  });

  describe("error logging", () => {
    it("should log unknown errors to console in development mode", async () => {
      const unknownError = new Error("Unknown error");

      const handler = withErrorHandler(
        async () => {
          throw unknownError;
        },
        { isDevelopment: true }
      );

      await handler(createRequest());

      expect(consoleSpy).toHaveBeenCalledWith("Unhandled error:", unknownError);
    });

    it("should not log errors in production mode", async () => {
      const unknownError = new Error("Unknown error");

      const handler = withErrorHandler(
        async () => {
          throw unknownError;
        },
        { isDevelopment: false }
      );

      await handler(createRequest());

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
