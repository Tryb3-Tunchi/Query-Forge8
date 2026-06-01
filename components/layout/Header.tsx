"use client";

import { motion } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { useQueryStore } from "@/store/queryStore";
import { useHistoryStore } from "@/store/historyStore";
import { SCHEMAS } from "@/components/schema/schemas";
import {
  generateSQL,
  generateMongo,
  generateQueryJSON,
} from "@/lib/queryParser";
import { validateQuery } from "@/lib/queryValidator";
import { countNodes } from "@/lib/utils";
import toast from "react-hot-toast";
import { SchemaSelector } from "@/components/schema/SchemaSelector";

export function Header() {
  const {
    theme,
    toggleTheme,
    showHistory,
    setShowHistory,
    showPresets,
    setShowPresets,
  } = useUIStore();
  const { rootGroup, schemaId } = useQueryStore();
  const { addToHistory } = useHistoryStore();

  const schema = SCHEMAS.find((s) => s.id === schemaId)!;
  const nodeCount = countNodes(rootGroup);
  const errors = validateQuery(rootGroup, schema);

  const handleExport = () => {
    const data = {
      schema: schemaId,
      query: rootGroup,
      sql: generateSQL(rootGroup, schema),
      mongo: JSON.parse(generateMongo(rootGroup, schema)),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-${Date.now()}.json`;
    a.click();
    toast.success("Query exported");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Security: limit file size
      if (file.size > 500000) {
        toast.error("File too large (max 500KB)");
        return;
      }

      try {
        const text = await file.text();

        // Security: strip any potential script injection
        const sanitized = text.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          "",
        );

        const data = JSON.parse(sanitized);

        // Validate structure before loading
        if (!data.query || data.query.type !== "group") {
          throw new Error("Invalid query format");
        }
        if (!data.query.children || !Array.isArray(data.query.children)) {
          throw new Error("Malformed query structure");
        }
        // Validate nesting isn't maliciously deep
        const checkDepth = (node: any, depth = 0): boolean => {
          if (depth > 20) return false;
          if (node.type === "group") {
            return node.children.every((c: any) => checkDepth(c, depth + 1));
          }
          return true;
        };
        if (!checkDepth(data.query)) {
          throw new Error("Query nesting too deep");
        }

        useQueryStore.getState().loadState({
          rootGroup: data.query,
          schemaId: data.schema || schemaId,
        });
        toast.success("Query imported successfully");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Invalid query file");
      }
    };
    input.click();
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <motion.div
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "2px solid var(--amber-pure)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--amber-pure)",
            fontSize: "14px",
            boxShadow: "var(--shadow-glow-amber)",
          }}
        >
          ◈
        </motion.div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              lineHeight: 1,
              color: "var(--text-primary)",
            }}
          >
            QueryForge
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--amber-dim)",
              letterSpacing: "0.1em",
            }}
          >
            VISUAL QUERY ENGINE v1.0
          </div>
        </div>
      </div>

      {/* Center: Schema + stats */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <SchemaSelector />

        <div
          style={{
            display: "flex",
            gap: "8px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-secondary)",
          }}
        >
          <span style={{ color: "var(--amber-pure)" }}>{nodeCount}</span> rules
          {errors.length > 0 && (
            <span style={{ color: "var(--rose-accent)" }}>
              · {errors.length} error{errors.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <HeaderButton onClick={handleImport} title="Import JSON (Ctrl+I)">
          ↑ Import
        </HeaderButton>
        <HeaderButton onClick={handleExport} title="Export JSON (Ctrl+E)">
          ↓ Export
        </HeaderButton>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "var(--border-subtle)",
            margin: "0 4px",
          }}
        />
        <HeaderButton
          onClick={() => setShowHistory(!showHistory)}
          active={showHistory}
          title="Query History (Ctrl+H)"
        >
          ⏱ History
        </HeaderButton>
        <HeaderButton
          onClick={() => setShowPresets(!showPresets)}
          active={showPresets}
          title="Saved Presets (Ctrl+P)"
        >
          ★ Presets
        </HeaderButton>
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "var(--border-subtle)",
            margin: "0 4px",
          }}
        />
        <button
          onClick={toggleTheme}
          title="Toggle theme (Ctrl+T)"
          style={{
            background: "none",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            padding: "5px 10px",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            transition: "all 0.2s",
          }}
        >
          {theme === "dark" ? "☀" : "◑"}
        </button>
      </div>
    </motion.header>
  );
}

function HeaderButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: active ? "var(--amber-glow)" : "none",
        border: `1px solid ${active ? "var(--amber-dim)" : "var(--border-subtle)"}`,
        color: active ? "var(--amber-pure)" : "var(--text-secondary)",
        padding: "5px 10px",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
