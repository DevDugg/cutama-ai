import { IValidationResult } from "../types/validator";
import { RequiredRule, UrlFormatRule } from "./rules";
import { BaseValidator } from "./validator";

export class UrlValidator extends BaseValidator<string> {
  constructor(required: boolean = true) {
    super();
    this.addRules("url", [new RequiredRule(required), new UrlFormatRule()]);
  }

  async validate(data: string): Promise<IValidationResult> {
    const result = await super.validate(data);
    if (result.isValid) {
      return result;
    }
    return result;
  }
}
