export interface IValidationRule<T> {
  validate(value: T): Promise<boolean>;
  getMessage(): string;
  getCode(): string;
}

export interface IValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
