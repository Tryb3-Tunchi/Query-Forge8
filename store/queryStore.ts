import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { QueryGroup, QueryRule, QueryNode, LogicOperator, QueryState } from '@/types/query';
import { generateId, createDefaultRule, createDefaultGroup, deepClone } from '@/lib/utils';

interface QueryStore extends QueryState {
  // Actions
  setSchema: (schemaId: string) => void;
  addRule: (groupId: string) => void;
  addGroup: (groupId: string) => void;
  removeNode: (nodeId: string) => void;
  updateRule: (ruleId: string, updates: Partial<QueryRule>) => void;
  updateGroupLogic: (groupId: string, logic: LogicOperator) => void;
  toggleGroupCollapse: (groupId: string) => void;
  setGroupLabel: (groupId: string, label: string) => void;
  moveNode: (nodeId: string, targetGroupId: string, index: number) => void;
  resetQuery: () => void;
  loadState: (state: QueryState) => void;
}

const defaultRoot = (): QueryGroup => ({
  id: 'root',
  type: 'group',
  logic: 'AND',
  collapsed: false,
  children: [createDefaultRule()],
});

function findAndUpdate(
  group: QueryGroup,
  targetId: string,
  updater: (node: QueryNode) => void
): boolean {
  for (const child of group.children) {
    if (child.id === targetId) {
      updater(child);
      return true;
    }
    if (child.type === 'group') {
      if (findAndUpdate(child as QueryGroup, targetId, updater)) return true;
    }
  }
  return false;
}

function findGroup(group: QueryGroup, targetId: string): QueryGroup | null {
  if (group.id === targetId) return group;
  for (const child of group.children) {
    if (child.type === 'group') {
      const found = findGroup(child as QueryGroup, targetId);
      if (found) return found;
    }
  }
  return null;
}

function removeFromTree(group: QueryGroup, nodeId: string): boolean {
  const idx = group.children.findIndex(c => c.id === nodeId);
  if (idx !== -1) {
    group.children.splice(idx, 1);
    return true;
  }
  for (const child of group.children) {
    if (child.type === 'group') {
      if (removeFromTree(child as QueryGroup, nodeId)) return true;
    }
  }
  return false;
}

export const useQueryStore = create<QueryStore>()(
  immer((set) => ({
    rootGroup: defaultRoot(),
    schemaId: 'users',

    setSchema: (schemaId) => set(state => { state.schemaId = schemaId; }),

    addRule: (groupId) => set(state => {
      const group = findGroup(state.rootGroup, groupId);
      if (group) group.children.push(createDefaultRule());
    }),

    addGroup: (groupId) => set(state => {
      const group = findGroup(state.rootGroup, groupId);
      if (group) group.children.push(createDefaultGroup('AND'));
    }),

    removeNode: (nodeId) => set(state => {
      removeFromTree(state.rootGroup, nodeId);
    }),

    updateRule: (ruleId, updates) => set(state => {
      findAndUpdate(state.rootGroup, ruleId, node => {
        Object.assign(node, updates);
      });
    }),

    updateGroupLogic: (groupId, logic) => set(state => {
      const group = findGroup(state.rootGroup, groupId);
      if (group) group.logic = logic;
    }),

    toggleGroupCollapse: (groupId) => set(state => {
      const group = findGroup(state.rootGroup, groupId);
      if (group) group.collapsed = !group.collapsed;
    }),

    setGroupLabel: (groupId, label) => set(state => {
      const group = findGroup(state.rootGroup, groupId);
      if (group) group.label = label;
    }),

    moveNode: (nodeId, targetGroupId, index) => set(state => {
      // find the node
      let node: QueryNode | null = null;
      const findNode = (g: QueryGroup): void => {
        for (const c of g.children) {
          if (c.id === nodeId) { node = c; return; }
          if (c.type === 'group') findNode(c as QueryGroup);
        }
      };
      findNode(state.rootGroup);
      if (!node) return;
      
      removeFromTree(state.rootGroup, nodeId);
      const targetGroup = findGroup(state.rootGroup, targetGroupId);
      if (targetGroup) {
        const clampedIndex = Math.min(index, targetGroup.children.length);
        targetGroup.children.splice(clampedIndex, 0, node);
      }
    }),

    resetQuery: () => set(state => {
      state.rootGroup = defaultRoot();
    }),

    loadState: (loadedState) => set(state => {
      state.rootGroup = loadedState.rootGroup;
      state.schemaId = loadedState.schemaId;
    }),
  }))
);