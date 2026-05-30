import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import { QueryGroup, QueryRule } from '@/types/query';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return nanoid(8);
}

export function createDefaultRule(fieldKey: string = ''): QueryRule {
  return {
    id: generateId(),
    type: 'rule',
    field: fieldKey,
    operator: 'equals',
    value: '',
  };
}

export function createDefaultGroup(logic: 'AND' | 'OR' = 'AND'): QueryGroup {
  return {
    id: generateId(),
    type: 'group',
    logic,
    collapsed: false,
    children: [createDefaultRule()],
  };
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function countNodes(group: QueryGroup): number {
  let count = 0;
  for (const child of group.children) {
    if (child.type === 'rule') count++;
    else count += countNodes(child as QueryGroup) + 1;
  }
  return count;
}