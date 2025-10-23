import type { JSONContent } from "@tiptap/react";

export type DiffOp =
  | { type: "equal"; text: string }
  | { type: "add"; text: string }
  | { type: "remove"; text: string };

// Extract plain text for a single JSONContent node recursively
function getText(node: JSONContent): string {
  if (!node) {
    return "";
  }
  if (typeof node.text === "string") {
    return node.text || "";
  }
  const children = (node.content || []) as JSONContent[];
  if (!children || children.length === 0) return "";
  return children.map(getText).join("");
}

// Convert TipTap JSONContent[] to an array of lines for line-based diff
export function extractLinesFromJSONContent(
  nodes: JSONContent[] = []
): string[] {
  const lines: string[] = [];
  const pushNonEmpty = (s: string) => {
    // keep empty lines as empty string to preserve structure
    lines.push(s);
  };

  for (const node of nodes) {
    switch (node.type) {
      case "heading":
      case "paragraph": {
        const t = getText(node);
        pushNonEmpty(t);
        break;
      }
      case "bulletList":
      case "orderedList": {
        for (const item of node.content || []) {
          if (item.type === "listItem") {
            const t = getText(item);
            pushNonEmpty(t);
          }
        }
        break;
      }
      case "details": {
        // summary as line, and then flatten following siblings will be handled by caller
        const summary = (node.content && node.content[0]) || null;
        if (summary) pushNonEmpty(getText(summary));
        break;
      }
      default: {
        // For other blocks like images/code blocks etc., include a placeholder text
        if (node.type === "image") {
          const alt = (node.attrs?.alt as string) || "";
          const src = (node.attrs?.src as string) || node.attrs?.url || "";
          pushNonEmpty(`[image] ${alt} ${src}`.trim());
        } else if (node.type === "codeBlock") {
          pushNonEmpty(getText(node));
        } else {
          // generic fallback
          const t = getText(node);
          if (t) pushNonEmpty(t);
        }
        break;
      }
    }
  }

  return lines;
}

// Simple LCS-based diff for arrays of strings
export function diffLines(a: string[], b: string[]): DiffOp[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0)
  );

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: DiffOp[] = [];
  let i = 0,
    j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: "equal", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", text: a[i] });
      i++;
    } else {
      ops.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < n) {
    ops.push({ type: "remove", text: a[i++] });
  }
  while (j < m) {
    ops.push({ type: "add", text: b[j++] });
  }
  return ops;
}
