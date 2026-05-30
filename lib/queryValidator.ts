import {
  QueryGroup,
  QueryRule,
  QueryNode,
  Schema,
  ValidationError,
  OPERATORS_BY_TYPE,
} from "@/types/query";

export function validateQuery(
  group: QueryGroup,
  schema: Schema,
): ValidationError[] {
  const errors: ValidationError[] = [];
  validateNode(group, schema, errors);
  return errors;
}

function validateNode(
  node: QueryNode,
  schema: Schema,
  errors: ValidationError[],
): void {
  if (node.type === "rule") {
    validateRule(node as QueryRule, schema, errors);
  } else {
    validateGroup(node as QueryGroup, schema, errors);
  }
}

function validateRule(
  rule: QueryRule,
  schema: Schema,
  errors: ValidationError[],
): void {
  if (!rule.field) {
    errors.push({ nodeId: rule.id, message: "Field is required" });
    return;
  }

  const fieldDef = schema.fields.find((f) => f.key === rule.field);
  if (!fieldDef) {
    errors.push({ nodeId: rule.id, message: `Unknown field: ${rule.field}` });
    return;
  }

  const validOps = OPERATORS_BY_TYPE[fieldDef.type];
  if (!validOps.includes(rule.operator)) {
    errors.push({
      nodeId: rule.id,
      message: `Operator "${rule.operator}" is not valid for field type "${fieldDef.type}"`,
    });
    return;
  }

  const noValueOps = ["is_null", "is_not_null"];
  if (noValueOps.includes(rule.operator)) return;

  if (rule.value === "" || rule.value === null || rule.value === undefined) {
    errors.push({ nodeId: rule.id, message: "Value is required" });
    return;
  }

  if (fieldDef.type === "number") {
    if (isNaN(Number(rule.value))) {
      errors.push({ nodeId: rule.id, message: "Value must be a valid number" });
      return;
    }
    if (rule.operator === "between") {
      if (
        rule.value2 === "" ||
        rule.value2 === null ||
        rule.value2 === undefined
      ) {
        errors.push({
          nodeId: rule.id,
          message: "Second value required for between operator",
        });
      } else if (Number(rule.value) >= Number(rule.value2)) {
        errors.push({
          nodeId: rule.id,
          message: "First value must be less than second for between",
        });
      }
    }
  }

  if (fieldDef.type === "date") {
    if (isNaN(new Date(rule.value as string).getTime())) {
      errors.push({ nodeId: rule.id, message: "Invalid date value" });
      return;
    }
    if (rule.operator === "date_between") {
      if (!rule.value2) {
        errors.push({
          nodeId: rule.id,
          message: "End date required for date between operator",
        });
      } else if (
        new Date(rule.value as string) >= new Date(rule.value2 as string)
      ) {
        errors.push({
          nodeId: rule.id,
          message: "Start date must be before end date",
        });
      }
    }
  }

  if (rule.operator === "regex") {
    let regexValid = true;
    try {
      new RegExp(rule.value as string);
    } catch {
      regexValid = false;
    }
    if (!regexValid) {
      errors.push({
        nodeId: rule.id,
        message: "Invalid regular expression pattern",
      });
    }
  }
}

function validateGroup(
  group: QueryGroup,
  schema: Schema,
  errors: ValidationError[],
): void {
  if (group.children.length === 0) {
    errors.push({
      nodeId: group.id,
      message: "Group must contain at least one condition",
    });
    return;
  }
  for (const child of group.children) {
    validateNode(child, schema, errors);
  }
}
