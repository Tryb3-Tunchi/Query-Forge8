'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { QueryGroup, Schema, ValidationError } from '@/types/query';
import { useQueryStore } from '@/store/queryStore';
import { ConditionRule } from './ConditionRule';
import { AddControls } from './AddControls';
import { GroupHeader } from './GroupHeader';

interface Props {
  group: QueryGroup;
  depth: number;
  isRoot?: boolean;
  schema: Schema;
  errors: ValidationError[];
  onRemove?: () => void;
}

const DEPTH_COLORS = [
  'var(--amber-dim)',
  'var(--cyan-accent)',
  'var(--violet-accent)',
  'var(--rose-accent)',
];

export function ConditionGroup({ group, depth, isRoot, schema, errors, onRemove }: Props) {
  const { addRule, addGroup, removeNode, moveNode } = useQueryStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const borderColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];
  const isCollapsed = group.collapsed;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = group.children.findIndex(c => c.id === active.id);
    const newIndex = group.children.findIndex(c => c.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(group.children, oldIndex, newIndex);
      newOrder.forEach((child, i) => {
        moveNode(child.id, group.id, i);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="group-zone"
      style={{
        borderColor: `${borderColor}30`,
        marginBottom: depth === 0 ? '0' : '8px',
      }}
    >
      {/* Depth indicator bar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: borderColor,
        opacity: 0.6,
        borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
      }} />

      <GroupHeader
        group={group}
        isRoot={isRoot}
        depth={depth}
        borderColor={borderColor}
        schema={schema}
        onRemove={onRemove}
      />

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '8px 12px 12px 20px', position: 'relative' }}>
              {/* Connector line */}
              {group.children.length > 1 && (
                <div style={{
                  position: 'absolute',
                  left: '32px',
                  top: '8px',
                  bottom: '48px',
                  width: '2px',
                  background: `linear-gradient(to bottom, ${borderColor}50, transparent)`,
                  pointerEvents: 'none',
                }} />
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={group.children.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {group.children.map((child, index) => {
                      const hasError = errors.some(e => e.nodeId === child.id);

                      if (child.type === 'rule') {
                        return (
                          <div key={child.id} style={{ position: 'relative' }}>
                            {index > 0 && (
                              <div style={{
                                position: 'absolute',
                                left: '-20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                letterSpacing: '0.1em',
                                color: group.logic === 'AND' ? 'var(--cyan-accent)' : 'var(--rose-accent)',
                                background: group.logic === 'AND' ? 'var(--cyan-dim)' : 'var(--rose-dim)',
                                padding: '1px 4px',
                                borderRadius: '2px',
                                userSelect: 'none',
                              }}>
                                {group.logic}
                              </div>
                            )}
                            <ConditionRule
                              rule={child}
                              schema={schema}
                              hasError={hasError}
                              errorMessage={errors.find(e => e.nodeId === child.id)?.message}
                              onRemove={() => removeNode(child.id)}
                            />
                          </div>
                        );
                      }

                      return (
                        <div key={child.id} style={{ position: 'relative', paddingLeft: '12px' }}>
                          {index > 0 && (
                            <div style={{
                              position: 'absolute',
                              left: '-8px',
                              top: '16px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '9px',
                              letterSpacing: '0.1em',
                              color: group.logic === 'AND' ? 'var(--cyan-accent)' : 'var(--rose-accent)',
                              background: group.logic === 'AND' ? 'var(--cyan-dim)' : 'var(--rose-dim)',
                              padding: '1px 4px',
                              borderRadius: '2px',
                              userSelect: 'none',
                            }}>
                              {group.logic}
                            </div>
                          )}
                          <ConditionGroup
                            key={child.id}
                            group={child as QueryGroup}
                            depth={depth + 1}
                            schema={schema}
                            errors={errors}
                            onRemove={() => removeNode(child.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              <AddControls
                onAddRule={() => addRule(group.id)}
                onAddGroup={() => addGroup(group.id)}
                depth={depth}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}