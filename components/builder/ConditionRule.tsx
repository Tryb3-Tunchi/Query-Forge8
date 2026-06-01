"use client";

import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  QueryRule,
  Schema,
  OPERATOR_LABELS,
  OPERATORS_BY_TYPE,
} from "@/types/query";
import { useQueryStore } from "@/store/queryStore";
import { ValueInput } from "@/components/ui/ValueInput";

interface Props {
  rule: QueryRule;
  schema: Schema;
  hasError: boolean;
  errorMessage?: string;
  onRemove: () => void;
}

export function ConditionRule({
  rule,
  schema,
  hasError,
  errorMessage,
  onRemove,
}: Props) {
  const { updateRule } = useQueryStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const fieldDef = schema.fields.find((f) => f.key === rule.field);
  const validOperators = fieldDef ? OPERATORS_BY_TYPE[fieldDef.type] : [];

  const handleFieldChange = (field: string) => {
    const newFieldDef = schema.fields.find((f) => f.key === field);
    const ops = newFieldDef ? OPERATORS_BY_TYPE[newFieldDef.type] : [];
    const newOperator = ops.includes(rule.operator) ? rule.operator : ops[0];
    updateRule(rule.id, { field, operator: newOperator, value: "" });
  };

  const needsNoValue = ["is_null", "is_not_null"].includes(rule.operator);
  const needsTwoValues = ["between", "date_between"].includes(rule.operator);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
          marginBottom: "8px",
        }}
      />
    );

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`rule-row${hasError ? " error" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 10px",
          flexWrap: "wrap",
        }}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            color: "var(--text-muted)",
            fontSize: "12px",
            padding: "2px 4px",
            userSelect: "none",
            flexShrink: 0,
          }}
          title="Drag to reorder"
        >
          ⣿
        </div>

        {/* Rule number */}
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: hasError
              ? "rgba(255,77,109,0.15)"
              : "var(--amber-trace)",
            border: `1px solid ${hasError ? "rgba(255,77,109,0.4)" : "var(--border-subtle)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: hasError ? "var(--rose-accent)" : "var(--amber-dim)",
            flexShrink: 0,
          }}
        >
          ▸
        </div>

        {/* Field selector */}
        <select
          value={rule.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          className="forge-select"
          style={{ minWidth: "130px", flex: "0 0 auto" }}
        >
          <option value="">— Field —</option>
          {schema.fields.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Operator selector */}
        <select
          value={rule.operator}
          onChange={(e) =>
            updateRule(rule.id, {
              operator: e.target.value as QueryRule["operator"],
              value: "",
            })
          }
          className="forge-select"
          style={{ minWidth: "160px", flex: "0 0 auto" }}
          disabled={!rule.field}
        >
          {validOperators.map((op) => (
            <option key={op} value={op}>
              {OPERATOR_LABELS[op]}
            </option>
          ))}
        </select>

        {/* Value input(s) */}
        {!needsNoValue && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <ValueInput
              rule={rule}
              schema={schema}
              onChange={(val) => updateRule(rule.id, { value: val })}
            />
            {needsTwoValues && (
              <>
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    flexShrink: 0,
                  }}
                >
                  ↔
                </span>
                <ValueInput
                  rule={{ ...rule, value: rule.value2 as string }}
                  schema={schema}
                  onChange={(val) => updateRule(rule.id, { value2: val })}
                  placeholder="end value"
                />
              </>
            )}
          </div>
        )}

        {needsNoValue && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-muted)",
              padding: "4px 8px",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-sm)",
              border: "1px dashed var(--border-subtle)",
            }}
          >
            no value needed
          </div>
        )}

        {/* Remove */}
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "14px",
            padding: "2px 6px",
            borderRadius: "3px",
            marginLeft: "auto",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
          title="Remove rule"
        >
          ×
        </button>
      </motion.div>

      {/* Error message */}
      {hasError && errorMessage && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--rose-accent)",
            padding: "3px 10px 3px 44px",
            background: "rgba(255,77,109,0.05)",
          }}
        >
          ⚠ {errorMessage}
        </div>
      )}
    </div>
  );
}
