import { BaseValidator } from "../validator";
import { RequiredRule, UrlFormatRule } from "../rules";

class TestValidator extends BaseValidator<{ name: string; url: string }> {
  constructor() {
    super();
    this.addRules("name", [new RequiredRule(true)]);
    this.addRules("url", [new RequiredRule(true), new UrlFormatRule()]);
  }
}

describe("BaseValidator", () => {
  let validator: TestValidator;

  beforeEach(() => {
    validator = new TestValidator();
  });

  it("should pass validation with valid data", async () => {
    const result = await validator.validate({
      name: "Test Name",
      url: "https://example.com",
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail validation with missing required fields", async () => {
    const result = await validator.validate({
      name: "",
      url: "",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);

    // name errors
    const nameErrors = result.errors.filter((e) => e.field === "name");
    expect(nameErrors).toHaveLength(1);
    expect(nameErrors[0].code).toBe("REQUIRED");

    //  url errors
    const urlErrors = result.errors.filter((e) => e.field === "url");
    expect(urlErrors).toHaveLength(2);
    expect(urlErrors[0].code).toBe("REQUIRED");
    expect(urlErrors[1].code).toBe("INVALID_URL_FORMAT");
  });

  it("should fail validation with invalid URL format", async () => {
    const result = await validator.validate({
      name: "Test Name",
      url: "not-a-valid-url",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe("url");
    expect(result.errors[0].code).toBe("INVALID_URL_FORMAT");
  });

  it("should handle multiple validation rules per field", async () => {
    let result = await validator.validate({
      name: "Test Name",
      url: "",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
    const errors = result.errors.map((e) => e.code);
    expect(errors).toContain("REQUIRED");
    expect(errors).toContain("INVALID_URL_FORMAT");

    result = await validator.validate({
      name: "Test Name",
      url: "invalid-url",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].code).toBe("INVALID_URL_FORMAT");
  });

  it("should return all validation errors for a field", async () => {
    const result = await validator.validate({
      name: "",
      url: "not-a-valid-url",
    });

    expect(result.isValid).toBe(false);

    expect(result.errors).toHaveLength(2);

    const nameError = result.errors.find((e) => e.field === "name");
    expect(nameError?.code).toBe("REQUIRED");

    const urlError = result.errors.find((e) => e.field === "url");
    expect(urlError?.code).toBe("INVALID_URL_FORMAT");
  });
});
