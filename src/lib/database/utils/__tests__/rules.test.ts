import { RequiredRule, UrlFormatRule } from "../rules";

describe("RequiredRule", () => {
  it("should pass when required=true and value is present", async () => {
    const rule = new RequiredRule(true);
    expect(await rule.validate("some value")).toBe(true);
    expect(await rule.validate(0)).toBe(true);
    expect(await rule.validate(false)).toBe(true);
  });

  it("should fail when required=true and value is null or undefined", async () => {
    const rule = new RequiredRule(true);
    expect(await rule.validate(null)).toBe(false);
    expect(await rule.validate(undefined)).toBe(false);
  });

  it("should pass when required=false regardless of value", async () => {
    const rule = new RequiredRule(false);
    expect(await rule.validate("value")).toBe(true);
    expect(await rule.validate(null)).toBe(true);
    expect(await rule.validate(undefined)).toBe(true);
  });

  it("should return correct message and code", () => {
    const rule = new RequiredRule(true);
    expect(rule.getMessage()).toBe("This field is required");
    expect(rule.getCode()).toBe("REQUIRED");
  });
});

describe("UrlFormatRule", () => {
  it("should pass for valid URLs", async () => {
    const rule = new UrlFormatRule();
    expect(await rule.validate("https://www.example.com")).toBe(true);
    expect(await rule.validate("http://localhost:3000")).toBe(true);
    expect(await rule.validate("www.example.com")).toBe(true);
  });

  it("should fail for invalid URLs", async () => {
    const rule = new UrlFormatRule();
    expect(await rule.validate("not-a-url")).toBe(false);
    expect(await rule.validate("http://")).toBe(false);
    expect(await rule.validate("")).toBe(false);
  });

  it("should return correct message and code", () => {
    const rule = new UrlFormatRule();
    expect(rule.getMessage()).toBe("Invalid URL format");
    expect(rule.getCode()).toBe("INVALID_URL_FORMAT");
  });
});
