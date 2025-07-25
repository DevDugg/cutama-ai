import { BadRequestError } from "../bad-request-error";
import { NotFoundError } from "../not-found-error";
import { ModelError } from "../model-error";
import { CustomError } from "../custom-error";

describe("Error Classes", () => {
  describe("BadRequestError", () => {
    it("should be an instance of CustomError", () => {
      const error = new BadRequestError("test message");
      expect(error).toBeInstanceOf(CustomError);
    });

    it("should have correct status code", () => {
      const error = new BadRequestError("test message");
      expect(error.statusCode).toBe(400);
    });

    it("should serialize errors correctly", () => {
      const message = "Invalid input";
      const error = new BadRequestError(message);
      const serialized = error.serializeErrors();

      expect(serialized).toHaveLength(1);
      expect(serialized[0]).toEqual({ message });
    });

    it("should maintain prototype chain for instanceof checks", () => {
      const error = new BadRequestError("test message");
      expect(error instanceof BadRequestError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe("NotFoundError", () => {
    it("should be an instance of CustomError", () => {
      const error = new NotFoundError();
      expect(error).toBeInstanceOf(CustomError);
    });

    it("should have correct status code", () => {
      const error = new NotFoundError();
      expect(error.statusCode).toBe(404);
    });

    it("should serialize errors correctly", () => {
      const error = new NotFoundError();
      const serialized = error.serializeErrors();

      expect(serialized).toHaveLength(1);
      expect(serialized[0]).toEqual({ message: "Not Found" });
    });

    it("should have correct default message", () => {
      const error = new NotFoundError();
      expect(error.message).toBe("Route not found");
    });
  });

  describe("ModelError", () => {
    it("should be an instance of CustomError", () => {
      const error = new ModelError("test message");
      expect(error).toBeInstanceOf(CustomError);
    });

    it("should have correct status code", () => {
      const error = new ModelError("test message");
      expect(error.statusCode).toBe(500);
    });

    it("should serialize errors correctly", () => {
      const message = "Database error";
      const error = new ModelError(message);
      const serialized = error.serializeErrors();

      expect(serialized).toHaveLength(1);
      expect(serialized[0]).toEqual({ message });
    });

    it("should set correct error name", () => {
      const error = new ModelError("test message");
      expect(error.name).toBe("ModelError");
    });
  });

  describe("Error Usage Examples", () => {
    it("should work in try-catch blocks", () => {
      expect(() => {
        throw new BadRequestError("Invalid input");
      }).toThrow(BadRequestError);
    });

    it("should maintain error message in try-catch", () => {
      try {
        throw new BadRequestError("Invalid input");
      } catch (error) {
        expect(error instanceof BadRequestError).toBe(true);
        if (error instanceof BadRequestError) {
          expect(error.message).toBe("Invalid input");
        }
      }
    });

    it("should be catchable as CustomError", () => {
      try {
        throw new ModelError("Database error");
      } catch (error) {
        expect(error instanceof CustomError).toBe(true);
        if (error instanceof CustomError) {
          expect(error.statusCode).toBe(500);
          expect(error.serializeErrors()).toEqual([
            { message: "Database error" },
          ]);
        }
      }
    });
  });
});
