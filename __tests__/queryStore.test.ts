import { describe, it, expect, beforeEach } from 'vitest';
import { useQueryStore } from '@/store/queryStore';

describe('queryStore', () => {
  beforeEach(() => {
    useQueryStore.getState().resetQuery();
  });

  it('initializes with root group and one rule', () => {
    const { rootGroup } = useQueryStore.getState();
    expect(rootGroup.type).toBe('group');
    expect(rootGroup.id).toBe('root');
    expect(rootGroup.children.length).toBe(1);
    expect(rootGroup.children[0].type).toBe('rule');
  });

  it('adds a rule to root group', () => {
    const { addRule, rootGroup } = useQueryStore.getState();
    addRule('root');
    const updated = useQueryStore.getState().rootGroup;
    expect(updated.children.length).toBe(2);
  });

  it('adds a nested group', () => {
    const { addGroup } = useQueryStore.getState();
    addGroup('root');
    const updated = useQueryStore.getState().rootGroup;
    const groups = updated.children.filter(c => c.type === 'group');
    expect(groups.length).toBe(1);
  });

  it('removes a node', () => {
    const { addRule, removeNode } = useQueryStore.getState();
    addRule('root');
    const { rootGroup: withTwo } = useQueryStore.getState();
    const ruleId = withTwo.children[1].id;
    removeNode(ruleId);
    const { rootGroup: withOne } = useQueryStore.getState();
    expect(withOne.children.length).toBe(1);
  });

  it('updates a rule', () => {
    const { rootGroup, updateRule } = useQueryStore.getState();
    const ruleId = rootGroup.children[0].id;
    updateRule(ruleId, { field: 'age', operator: 'greater_than', value: '18' });
    const updated = useQueryStore.getState().rootGroup.children[0] as any;
    expect(updated.field).toBe('age');
    expect(updated.operator).toBe('greater_than');
    expect(updated.value).toBe('18');
  });

  it('updates group logic', () => {
    const { updateGroupLogic } = useQueryStore.getState();
    updateGroupLogic('root', 'OR');
    expect(useQueryStore.getState().rootGroup.logic).toBe('OR');
  });

  it('toggles group collapse', () => {
    const { toggleGroupCollapse } = useQueryStore.getState();
    expect(useQueryStore.getState().rootGroup.collapsed).toBe(false);
    toggleGroupCollapse('root');
    expect(useQueryStore.getState().rootGroup.collapsed).toBe(true);
  });

  it('resets to initial state', () => {
    const { addRule, addGroup, resetQuery } = useQueryStore.getState();
    addRule('root');
    addGroup('root');
    resetQuery();
    const { rootGroup } = useQueryStore.getState();
    expect(rootGroup.children.length).toBe(1);
  });
});