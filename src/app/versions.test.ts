import { describe, expect, test } from "@jest/globals";
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
