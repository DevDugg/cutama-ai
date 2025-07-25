import { CustomError } from "./custom-error";

export class ModelError extends CustomError {
  statusCode = 500;

  constructor(message: string) {
    super(message);
    this.name = "ModelError";
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
