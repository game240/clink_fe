import React from "react";
import { type DiffOp } from "../utils/diff";

interface DiffViewerProps {
  leftTitle?: string;
  rightTitle?: string;
  variant?: "inline" | "split";
  ops?: DiffOp[]; // server-provided ops (optional)
}

const lineStyleBase: React.CSSProperties = {
  fontSize: 13,
  whiteSpace: "pre-wrap",
  padding: "2px 6px",
  borderRadius: 4,
};

const InlineRow: React.FC<{ op: DiffOp }> = ({ op }) => {
  if (op.type === "equal") {
    return <div style={{ ...lineStyleBase }}>{op.text || "\u00A0"}</div>;
  }
  if (op.type === "add") {
    return (
      <div
        style={{
          ...lineStyleBase,
          background: "#ecfdf5",
          color: "#065f46",
        }}
      >
        + {op.text}
      </div>
    );
  }
  return (
    <div
      style={{
        ...lineStyleBase,
        background: "#fee2e2",
        color: "#991b1b",
      }}
    >
      - {op.text}
    </div>
  );
};

const SplitRow: React.FC<{ left?: string; right?: string }> = ({
  left,
  right,
}) => {
  const baseCell: React.CSSProperties = {
    ...lineStyleBase,
    width: "100%",
    boxSizing: "border-box",
  };
  const leftStyle: React.CSSProperties =
    left === undefined
      ? { ...baseCell, background: "#fee2e2", color: "#991b1b" }
      : left && left.startsWith("[image]")
      ? { ...baseCell, background: "#f1f5f9", color: "#334155" }
      : baseCell;
  const rightStyle: React.CSSProperties =
    right === undefined
      ? { ...baseCell, background: "#ecfdf5", color: "#065f46" }
      : right && right.startsWith("[image]")
      ? { ...baseCell, background: "#f1f5f9", color: "#334155" }
      : baseCell;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={leftStyle}>{left ?? "\u00A0"}</div>
      <div style={rightStyle}>{right ?? "\u00A0"}</div>
    </div>
  );
};

const DiffViewer: React.FC<DiffViewerProps> = ({
  leftTitle = "이전",
  rightTitle = "현재",
  variant = "inline",
  ops,
}) => {
  const computedOps = ops ?? [];

  if (variant === "split") {
    // Build split rows by aligning operations
    const rows: Array<{ left?: string; right?: string }> = [];
    for (const op of computedOps) {
      if (op.type === "equal") {
        rows.push({ left: op.text, right: op.text });
      } else if (op.type === "remove") {
        rows.push({ left: op.text, right: undefined });
      } else if (op.type === "add") {
        rows.push({ left: undefined, right: op.text });
      }
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            fontWeight: 600,
            padding: "6px 0",
          }}
        >
          <div>{leftTitle}</div>
          <div>{rightTitle}</div>
        </div>
        {rows.map((r, i) => (
          <SplitRow key={i} left={r.left} right={r.right} />
        ))}
      </div>
    );
  }

  // inline
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {computedOps.map((op, i) => (
        <InlineRow key={i} op={op} />
      ))}
    </div>
  );
};

export default DiffViewer;
