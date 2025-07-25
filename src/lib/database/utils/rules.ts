import { IValidationRule } from "../types/validator";

export class RequiredRule implements IValidationRule<any> {
  private required: boolean;

  constructor(required: boolean) {
    this.required = required;
  }

  async validate(value: any): Promise<boolean> {
    if (!this.required) return true;
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  }

  getMessage(): string {
    return "This field is required";
  }

  getCode(): string {
    return "REQUIRED";
  }
}

export class UrlFormatRule implements IValidationRule<string> {
  async validate(value: string): Promise<boolean> {
    if (!value) return false;
    try {
      // Using URL constructor for more reliable URL validation
      new URL(value);
      return true;
    } catch {
      // If it's not a full URL, try prepending https:// and check if it's valid
      try {
        if (value.startsWith("www.") || value.includes(".")) {
          new URL(`https://${value}`);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }
  }

  getMessage(): string {
    return "Invalid URL format";
  }

  getCode(): string {
    return "INVALID_URL_FORMAT";
  }
}
