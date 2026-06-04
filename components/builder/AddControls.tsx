"use client";

interface Props {
  onAddRule: () => void;
  onAddGroup: () => void;
  depth: number;
}

export function AddControls({ onAddRule, onAddGroup, depth }: Props) {
  return (
    <div
      id="add-controls"
      style={{
        display: "flex",
        gap: "6px",
        marginTop: "10px",
        paddingTop: "10px",
        borderTop: "1px dashed var(--border-subtle)",
      }}
    >
      <button
        onClick={onAddRule}
        style={{
          background: "var(--amber-trace)",
          border: "1px solid var(--border-subtle)",
          color: "var(--amber-dim)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          padding: "5px 12px",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          transition: "all 0.15s",
        }}
      >
        <span>+</span> Add Rule
      </button>

      <button
        onClick={onAddGroup}
        style={{
          background: "transparent",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          padding: "5px 12px",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          transition: "all 0.15s",
        }}
      >
        <span>⊕</span> Add Group
      </button>
    </div>
  );
}
