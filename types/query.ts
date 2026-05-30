export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array';

export type Operator =
  | 'equals' | 'not_equals' | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than'
  | 'greater_equal' | 'less_equal' | 'in_array' | 'not_in_array'
  | 'between' | 'is_null' | 'is_not_null' | 'regex'
  | 'date_before' | 'date_after' | 'date_between';

export type LogicOperator = 'AND' | 'OR';

export interface SchemaField {
  key: string;
  label: string;
  type: FieldType;
  enumValues?: string[];
  description?: string;
}

export interface Schema {
  id: string;
  name: string;
  icon: string;
  fields: SchemaField[];
  mockData: Record<string, unknown>[];
}

export interface QueryRule {
  id: string;
  type: 'rule';
  field: string;
  operator: Operator;
  value: unknown;
  value2?: unknown; // for 'between'
}

export interface QueryGroup {
  id: string;
  type: 'group';
  logic: LogicOperator;
  collapsed: boolean;
  label?: string;
  children: QueryNode[];
}

export type QueryNode = QueryRule | QueryGroup;

export interface QueryState {
  rootGroup: QueryGroup;
  schemaId: string;
}

export interface ValidationError {
  nodeId: string;
  message: string;
}

export interface QueryHistoryEntry {
  id: string;
  timestamp: number;
  name?: string;
  state: QueryState;
  resultCount?: number;
}

export interface QueryPreset {
  id: string;
  name: string;
  description?: string;
  state: QueryState;
  tags: string[];
}

export const OPERATOR_LABELS: Record<Operator, string> = {
  equals: '= equals',
  not_equals: '≠ not equals',
  contains: '⊃ contains',
  not_contains: '⊅ not contains',
  starts_with: '↗ starts with',
  ends_with: '↘ ends with',
  greater_than: '> greater than',
  less_than: '< less than',
  greater_equal: '≥ greater or equal',
  less_equal: '≤ less or equal',
  in_array: '∈ in array',
  not_in_array: '∉ not in array',
  between: '↔ between',
  is_null: '∅ is null',
  is_not_null: '∃ is not null',
  regex: '⌘ matches regex',
  date_before: '◀ date before',
  date_after: '▶ date after',
  date_between: '⟺ date between',
};

export const OPERATORS_BY_TYPE: Record<FieldType, Operator[]> = {
  string: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_null', 'is_not_null', 'regex'],
  number: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'is_null', 'is_not_null'],
  boolean: ['equals', 'not_equals'],
  date: ['equals', 'not_equals', 'date_before', 'date_after', 'date_between', 'is_null', 'is_not_null'],
  enum: ['equals', 'not_equals', 'in_array', 'not_in_array', 'is_null', 'is_not_null'],
  array: ['contains', 'not_contains', 'in_array', 'not_in_array', 'is_null', 'is_not_null'],
};