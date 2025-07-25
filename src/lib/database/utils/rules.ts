import { IValidationRule } from "../types/validator";

export class RequiredRule implements IValidationRule<any> {
  private required: boolean;

  constructor(required: boolean) {
    this.required = required;
  }

  async validate(value: any): Promise<boolean> {
    return this.required ? value !== undefined && value !== null : true;
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
    const urlRegex: RegExp =
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return urlRegex.test(value);
  }

  getMessage(): string {
    return "Invalid URL format";
  }

  getCode(): string {
    return "INVALID_URL_FORMAT";
  }
}
