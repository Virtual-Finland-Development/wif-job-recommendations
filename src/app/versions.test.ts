import { describe, expect, test } from "@jest/globals";
import { parseDataProductVersionText } from "./data-products";
import { isGreaterOrEqualThanVersion, isGreaterThanVersion, isLessOrEqualThanVersion, isLessThanVersion } from "./versions";

describe("Test version comparison", () => {
  test("Greater than", () => {
    expect(isGreaterThanVersion("1.2", "1"));
    expect(isGreaterThanVersion("1.2", "1.1"));
    expect(isGreaterThanVersion("1.2", "1.1.1"));
    expect(isGreaterOrEqualThanVersion("1.2", "1.2"));
  });

  test("Less than", () => {
    expect(isLessThanVersion("1", "1.2"));
    expect(isLessThanVersion("1.1", "2"));
    expect(isLessThanVersion("1.1.1", "1.2"));
    expect(isLessOrEqualThanVersion("1.2", "1.2"));
  });
});

describe("Test parsers", () => {
  test("Parse version from path", () => {
    expect(parseDataProductVersionText("/Employment/ForeignerJobRecommendations_v1.2.3")).toBe("1.2.3");
    expect(parseDataProductVersionText("/Employment/ForeignerJobRecommendatations_v1.2.3")).toBe("1.2.3");
    expect(parseDataProductVersionText("/Employment/ForeignerJobRecommendations__v1.2.3")).toBe(undefined);
    expect(parseDataProductVersionText("/Employment/ForeignerJobRecommendations_v1.2.3_extra")).toBe(undefined);
  });
});
