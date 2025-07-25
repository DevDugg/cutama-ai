import {
  IValidationRule,
  IValidationResult,
  ValidationError,
} from "../types/validator";

export abstract class BaseValidator<T> {
  private rules: { [key: string]: IValidationRule<any>[] } = {};

  addRules(field: string, rules: IValidationRule<any>[]): void {
    this.rules[field] = rules;
  }

  async validate(data: T): Promise<IValidationResult> {
    const errors: ValidationError[] = [];
    for (const [field, rules] of Object.entries(this.rules)) {
      const value = (data as any)[field];
      for (const rule of rules) {
        const isValid = await rule.validate(value);
        if (!isValid) {
          errors.push({
            field,
            message: rule.getMessage(),
            code: rule.getCode(),
          });
        }
      }
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
