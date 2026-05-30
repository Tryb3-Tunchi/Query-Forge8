import { describe, it, expect } from "vitest";
import { validateQuery } from "@/lib/queryValidator";
import { SCHEMAS } from "@/components/schema/schemas";
import { QueryGroup } from "@/types/query";
import { generateId } from "@/lib/utils";

const schema = SCHEMAS.find((s) => s.id === "users")!;

const makeGroup = (children: QueryGroup["children"]): QueryGroup => ({
  id: "root",
  type: "group",
  logic: "AND",
  collapsed: false,
  children,
});

const makeRule = (overrides: Partial<any>): any => ({
  id: generateId(),
  type: "rule",
  field: "name",
  operator: "equals",
  value: "test",
  ...overrides,
});

describe("queryValidator", () => {
  it("returns no errors for valid query", () => {
    const group = makeGroup([
      makeRule({ field: "name", operator: "equals", value: "Adaeze" }),
    ]);
    expect(validateQuery(group, schema)).toHaveLength(0);
  });

  it("returns error for missing field", () => {
    const group = makeGroup([
      makeRule({ field: "", operator: "equals", value: "test" }),
    ]);
    const errors = validateQuery(group, schema);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/field/i);
  });

  it("returns error for invalid operator on wrong type", () => {
    const group = makeGroup([
      makeRule({ field: "age", operator: "contains", value: "25" }),
    ]);
    const errors = validateQuery(group, schema);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("returns error for empty value", () => {
    const group = makeGroup([
      makeRule({ field: "name", operator: "equals", value: "" }),
    ]);
    const errors = validateQuery(group, schema);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("returns no error for is_null with empty value", () => {
    const group = makeGroup([
      makeRule({ field: "name", operator: "is_null", value: "" }),
    ]);
    expect(validateQuery(group, schema)).toHaveLength(0);
  });

  it("returns error for between with missing second value", () => {
    const rule = {
      ...makeRule({ field: "age", operator: "between", value: "20" }),
      value2: undefined,
    } as any;
    const group = makeGroup([rule]);
    const errors = validateQuery(group, schema);
    expect(
      errors.some((e) => e.message.toLowerCase().includes("second value")),
    ).toBe(true);
  });

  it("returns error for empty nested group", () => {
    const inner: QueryGroup = {
      id: generateId(),
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [],
    };
    const group = makeGroup([inner]);
    const errors = validateQuery(group, schema);
    expect(errors.some((e) => e.message.includes("at least one"))).toBe(true);
  });

  it("returns error for invalid regex", () => {
    const group = makeGroup([
      makeRule({ field: "name", operator: "regex", value: "[invalid(" }),
    ]);
    const errors = validateQuery(group, schema);
    expect(
      errors.some((e) => e.message.toLowerCase().includes("invalid")),
    ).toBe(true);
  });

  it("returns error for non-numeric value on number field", () => {
    const group = makeGroup([
      makeRule({ field: "age", operator: "equals", value: "not-a-number" }),
    ]);
    const errors = validateQuery(group, schema);
    expect(errors.length).toBeGreaterThan(0);
  });
});
