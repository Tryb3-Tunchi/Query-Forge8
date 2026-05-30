import { QueryGroup, QueryRule, QueryNode, Schema } from '@/types/query';

export function executeQuery(
  data: Record<string, unknown>[],
  rootGroup: QueryGroup,
  schema: Schema
): Record<string, unknown>[] {
  return data.filter(row => evaluateGroup(row, rootGroup, schema));
}

function evaluateGroup(
  row: Record<string, unknown>,
  group: QueryGroup,
  schema: Schema
): boolean {
  if (group.children.length === 0) return true;

  const results = group.children.map(child => evaluateNode(row, child, schema));

  return group.logic === 'AND'
    ? results.every(Boolean)
    : results.some(Boolean);
}

function evaluateNode(
  row: Record<string, unknown>,
  node: QueryNode,
  schema: Schema
): boolean {
  if (node.type === 'group') return evaluateGroup(row, node as QueryGroup, schema);
  return evaluateRule(row, node as QueryRule, schema);
}

function evaluateRule(
  row: Record<string, unknown>,
  rule: QueryRule,
  schema: Schema
): boolean {
  if (!rule.field || !rule.operator) return true;

  const fieldDef = schema.fields.find(f => f.key === rule.field);
  if (!fieldDef) return true;

  const rowVal = row[rule.field];
  const ruleVal = rule.value;

  try {
    switch (rule.operator) {
      case 'equals': return String(rowVal).toLowerCase() === String(ruleVal).toLowerCase();
      case 'not_equals': return String(rowVal).toLowerCase() !== String(ruleVal).toLowerCase();
      case 'contains': return String(rowVal).toLowerCase().includes(String(ruleVal).toLowerCase());
      case 'not_contains': return !String(rowVal).toLowerCase().includes(String(ruleVal).toLowerCase());
      case 'starts_with': return String(rowVal).toLowerCase().startsWith(String(ruleVal).toLowerCase());
      case 'ends_with': return String(rowVal).toLowerCase().endsWith(String(ruleVal).toLowerCase());
      case 'greater_than': return Number(rowVal) > Number(ruleVal);
      case 'less_than': return Number(rowVal) < Number(ruleVal);
      case 'greater_equal': return Number(rowVal) >= Number(ruleVal);
      case 'less_equal': return Number(rowVal) <= Number(ruleVal);
      case 'between': return Number(rowVal) >= Number(ruleVal) && Number(rowVal) <= Number(rule.value2);
      case 'in_array': {
        const arr = String(ruleVal).split(',').map(s => s.trim().toLowerCase());
        return arr.includes(String(rowVal).toLowerCase());
      }
      case 'not_in_array': {
        const arr = String(ruleVal).split(',').map(s => s.trim().toLowerCase());
        return !arr.includes(String(rowVal).toLowerCase());
      }
      case 'is_null': return rowVal === null || rowVal === undefined || rowVal === '';
      case 'is_not_null': return rowVal !== null && rowVal !== undefined && rowVal !== '';
      case 'regex': return new RegExp(String(ruleVal)).test(String(rowVal));
      case 'date_before': return new Date(rowVal as string) < new Date(ruleVal as string);
      case 'date_after': return new Date(rowVal as string) > new Date(ruleVal as string);
      case 'date_between':
        return new Date(rowVal as string) >= new Date(ruleVal as string) &&
               new Date(rowVal as string) <= new Date(rule.value2 as string);
      default: return true;
    }
  } catch {
    return false;
  }
}