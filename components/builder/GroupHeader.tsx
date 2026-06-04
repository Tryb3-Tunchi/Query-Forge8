"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QueryGroup, Schema } from "@/types/query";
import { useQueryStore } from "@/store/queryStore";

interface Props {
  group: QueryGroup;
  isRoot?: boolean;
  depth: number;
  borderColor: string;
  schema: Schema;
  onRemove?: () => void;
}

export function GroupHeader({
  group,
  isRoot,
  depth,
  borderColor,
  schema,
  onRemove,
}: Props) {
  const { updateGroupLogic, toggleGroupCollapse, setGroupLabel } =
    useQueryStore();
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelVal, setLabelVal] = useState(group.label || "");

  const childCount = group.children.length;

  const handleLabelBlur = () => {
    setEditingLabel(false);
    setGroupLabel(group.id, labelVal);
  };

  return (
    <div
      id={isRoot ? "logic-toggle" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 12px 10px 20px",
        borderBottom: group.collapsed
          ? "none"
          : "1px solid var(--border-subtle)",
      }}
    >
      {/* Collapse button */}
      <button
        onClick={() => toggleGroupCollapse(group.id)}
        style={{
          background: "none",
          border: "none",
          color: borderColor,
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          padding: "2px 4px",
          borderRadius: "3px",
          transition: "transform 0.2s",
          transform: group.collapsed ? "rotate(-90deg)" : "rotate(0deg)",
        }}
      >
        ▾
      </button>

      {/* Group icon */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          background: `${borderColor}20`,
          border: `1px solid ${borderColor}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          color: borderColor,
          flexShrink: 0,
        }}
      >
        {isRoot ? "⊛" : "⊕"}
      </div>

      {/* Label */}
      {editingLabel ? (
        <input
          value={labelVal}
          onChange={(e) => setLabelVal(e.target.value)}
          onBlur={handleLabelBlur}
          onKeyDown={(e) => e.key === "Enter" && handleLabelBlur()}
          autoFocus
          style={{
            background: "var(--bg-elevated)",
            border: `1px solid ${borderColor}`,
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            padding: "2px 6px",
            borderRadius: "3px",
            outline: "none",
            minWidth: "80px",
          }}
        />
      ) : (
        <span
          onClick={() => setEditingLabel(true)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: group.label ? borderColor : "var(--text-muted)",
            cursor: "text",
            letterSpacing: "0.05em",
          }}
          title="Click to label this group"
        >
          {group.label || (isRoot ? "ROOT GROUP" : `GROUP ${depth}`)}
        </span>
      )}

      {/* Logic toggle */}
      <div style={{ display: "flex", gap: "3px", marginLeft: "4px" }}>
        {(["AND", "OR"] as const).map((op) => (
          <button
            key={op}
            onClick={() => updateGroupLogic(group.id, op)}
            style={{
              background:
                group.logic === op
                  ? op === "AND"
                    ? "rgba(0,229,204,0.15)"
                    : "rgba(255,77,109,0.15)"
                  : "transparent",
              border: `1px solid ${
                group.logic === op
                  ? op === "AND"
                    ? "var(--cyan-accent)"
                    : "var(--rose-accent)"
                  : "var(--border-subtle)"
              }`,
              color:
                group.logic === op
                  ? op === "AND"
                    ? "var(--cyan-accent)"
                    : "var(--rose-accent)"
                  : "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: "3px",
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "all 0.15s",
            }}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          marginLeft: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>
          {childCount} condition{childCount !== 1 ? "s" : ""}
        </span>

        {!isRoot && (
          <button
            onClick={onRemove}
            style={{
              background: "none",
              border: "1px solid rgba(255,77,109,0.3)",
              color: "var(--rose-accent)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "3px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            ✕ Remove
          </button>
        )}
      </div>
    </div>
  );
}
