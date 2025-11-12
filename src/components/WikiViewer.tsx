import React, { useEffect, useState, type JSX } from "react";
import type { JSONContent } from "@tiptap/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { transformPlaceholders } from "../utils/transformPlaceholders";
import { transformToggles } from "../utils/transformToggles";

import externalLinkIcon from "../assets/ic_external_link.svg";

import "./WikiViewer.scss";

type Segment = JSONContent[];
interface FootnoteItem {
  id: string;
  content: JSONContent[];
}

// Component to show skeleton until image loads
function ViewerImage({
  src,
  alt,
  title,
}: {
  src: string;
  alt?: string;
  title?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  return (
    <figure style={{ margin: 0 }}>
      {!loaded && <Skeleton width={600} height={400} />}
      {loaded && <img src={src} alt={alt} className="w-[600px]" />}
      {title && (
        <figcaption
          style={{ textAlign: "center", fontSize: "0.9em", color: "#666" }}
        >
          {title}
        </figcaption>
      )}
    </figure>
  );
}

// Recursively rewrite image src to go through proxy
const toProxyUrl = (path: string) =>
  `${import.meta.env.VITE_SERVER_URL}/api/image-proxy?path=${encodeURIComponent(
    path || ""
  )}`;

function rewriteImageSrcDeep(node: JSONContent): JSONContent {
  if (!node) return node;

  if (node.type === "image") {
    const originalSrc =
      typeof node.attrs?.src === "string" ? (node.attrs.src as string) : "";
    return {
      ...node,
      attrs: {
        ...node.attrs,
        src: toProxyUrl(originalSrc),
      },
    };
  }

  if (node.content && Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.map(rewriteImageSrcDeep),
    };
  }

  return node;
}

export default function WikiViewer({
  initialContent,
}: {
  initialContent: JSONContent[];
}) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [footnotes, setFootnotes] = useState<FootnoteItem[]>([]);
  const [hoveredFootnoteId, setHoveredFootnoteId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchWiki = async () => {
      try {
        const raw = initialContent;

        // 1) placeholder 변환 → 2) ==…== 토글 처리
        // 1) placeholder + toggle 처리 후 “토글은 최상위, 그 외는 paragraph 래핑”
        // useEffect 내 raw = data.content
        const flatContent: JSONContent[] = raw.flatMap((block) => {
          if (block.type === "image") {
            return [block];
          }

          // placeholder → toggle 처리
          const inlined = transformPlaceholders(block.content || []);
          const toggled = transformToggles(inlined);

          const result: JSONContent[] = [];
          let paraBuffer: JSONContent[] = [];

          toggled.forEach((node) => {
            if (node.type === "details") {
              if (paraBuffer.length) {
                result.push({ type: "paragraph", content: paraBuffer });
                paraBuffer = [];
              }
              result.push(node);
            } else {
              paraBuffer.push(node);
            }
          });

          // 일반 텍스트 버퍼가 남았으면 paragraph로
          if (paraBuffer.length) {
            result.push({ type: "paragraph", content: paraBuffer });
          }

          // 빈 paragraph 블록(줄바꿈)을 완전히 제거하지 말고 빈 paragraph 한 번 내보내기
          if (result.length === 0) {
            result.push({ type: "paragraph", content: [] });
          }

          return result;
        });

        // 2) 이미지 노드에 대해 presign URL 요청 (중첩 노드까지 모두 처리)
        const contentWithProxy = flatContent.map(rewriteImageSrcDeep);
        // 3) 'details' 기준으로 세그먼트 분할
        const segs: Segment[] = [];
        let buffer: JSONContent[] = [];

        contentWithProxy.forEach((node) => {
          if (node.type === "details") {
            if (buffer.length) {
              segs.push(buffer);
              buffer = [];
            }
            segs.push([node]);
          } else {
            buffer.push(node);
          }
        });
        if (buffer.length) segs.push(buffer);

        const notes: FootnoteItem[] = [];
        flatContent.forEach((node) => {
          // 재귀로 내부 노드까지 체크
          const collect = (n: JSONContent) => {
            if (n.type === "footnotePlaceholder") {
              notes.push({
                id: n.attrs?.id ?? "",
                content: (n.attrs?.content as JSONContent[]) ?? [],
              });
            }
            (n.content || []).forEach(collect);
          };
          collect(node);
        });
        setFootnotes(notes);

        setSegments(segs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWiki();
  }, [initialContent]);

  // Recursive renderer for JSONContent nodes
  const renderNode = (node: JSONContent, key: number): React.ReactNode => {
    const children = node.content
      ? node.content.map((child, idx) => renderNode(child, idx))
      : node.text;

    switch (node.type) {
      case "hardBreak":
        return <br key={key} />;
      case "paragraph":
        if (!node.content || node.content.length === 0) {
          return (
            <p key={key}>
              <br />
            </p>
          );
        }
        return <p key={key}>{children}</p>;

      case "heading": {
        const level = (node.attrs?.level as number) ?? 1;
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return <Tag key={key}>{children}</Tag>;
      }

      case "bulletList":
        return <ul key={key}>{children}</ul>;
      case "orderedList":
        return <ol key={key}>{children}</ol>;
      case "listItem":
        return <li key={key}>{children}</li>;

      case "text": {
        let content: React.ReactNode = node.text;
        if (node.marks) {
          node.marks.forEach((mark) => {
            switch (mark.type) {
              case "bold":
                content = <strong key={`${key}-bold`}>{content}</strong>;
                break;
              case "italic":
                content = <em key={`${key}-italic`}>{content}</em>;
                break;
              case "strike":
                content = <s key={`${key}-strike`}>{content}</s>;
                break;
              case "link": {
                const href =
                  typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
                content = (
                  <a
                    key={`${key}-link`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
                break;
              }
              default:
                break;
            }
          });
        }
        return <React.Fragment key={key}>{content}</React.Fragment>;
      }

      case "image": {
        const src = (node.attrs?.src as string) ?? "";
        const alt = (node.attrs?.alt as string) ?? undefined;
        const title = (node.attrs?.title as string) ?? undefined;
        return <ViewerImage key={key} src={src} alt={alt} title={title} />;
      }

      case "externalLinkPlaceholder": {
        const href = (node.attrs?.href as string) ?? "";
        const text = (node.attrs?.text as string) ?? children;
        const externalHref = href.startsWith("http") ? href : `https://${href}`;
        return (
          <span
            key={key}
            className="inline-flex items-center gap-[3px] translate-y-[2px]"
          >
            <img
              src={externalLinkIcon}
              alt="external-link"
              width={16}
              height={16}
              style={{ verticalAlign: "middle" }}
            />
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-15-400 text-[var(--green)]"
            >
              {text}
            </a>
          </span>
        );
      }

      case "internalLinkPlaceholder": {
        const text = (node.attrs?.text as string) ?? children;
        return (
          <a
            key={key}
            href={`/page/${text}`}
            className="wiki-internal-link text-[var(--blue)] translate-y-[2px]"
          >
            {text}
          </a>
        );
      }

      case "footnotePlaceholder": {
        const id = node.attrs?.id as string;

        const noteIndex = footnotes.findIndex((f) => f.id === id);
        const num = noteIndex >= 0 ? noteIndex + 1 : id;

        const content = noteIndex >= 0 ? footnotes[noteIndex].content : [];
        return (
          <span
            key={key}
            className="inline-block relative cursor-pointer"
            onMouseEnter={() => setHoveredFootnoteId(id)}
            onMouseLeave={() => setHoveredFootnoteId(null)}
          >
            <p className="text-[var(--blue)]">[{num}]</p>
            {hoveredFootnoteId === id && content && (
              <div className="absolute top-0 left-0 translate-y-[-100%] w-max max-w-[50vw] bg-white border-1 border-[#CCC] rounded-[6px] p-[8px] cursor-default">
                <p className="inline-flex text-[var(--blue)]">[{num}]</p>&nbsp;
                {content.map((node, idx) => renderNode(node, idx))}
              </div>
            )}
          </span>
        );
      }

      // Fallback for bracket/paren nodes
      case "bracket":
      case "blueBracket":
      case "paren":
      case "equals":
        return <span key={key}>{children}</span>;

      default:
        return <React.Fragment key={key}>{children}</React.Fragment>;
    }
  };

  const getTextContent = (node: JSONContent): string => {
    if ("text" in node) {
      return node.text || "";
    }
    return (node.content || []).map(getTextContent).join("");
  };

  const tocItems = segments
    .map((seg, idx) => ({ seg, idx }))
    .filter(({ seg }) => seg.length === 1 && seg[0].type === "details")
    .map(({ seg }, i) => {
      // seg[0] == details 노드, 그 안 첫 번째 자식이 summary
      const summaryNode = seg[0].content?.[0];
      const title = summaryNode
        ? getTextContent(summaryNode)
        : `Section ${i + 1}`;
      return {
        num: i + 1,
        title,
      };
    });

  return (
    <section>
      <div className="mt-[17px] mb-[32px] px-[14px] pt-[12px] pb-[18px] w-fit rounded-[6px] border-1 border-[#CCC]">
        <p className="mb-[12px] font-18-400">목차</p>
        <ul className="mx-[20px]">
          {tocItems.map((item) => (
            <li key={item.num}>
              <p className="flex items-center font-15-400">
                <p className="text-[var(--blue)]">{item.num}</p>.&nbsp;
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="wiki-viewer">
        {(() => {
          const elements: React.ReactNode[] = [];
          for (let i = 0; i < segments.length; i++) {
            const nodes = segments[i];

            // ① details 섹션이면 <details>로 묶어서 렌더
            if (nodes.length === 1 && nodes[0].type === "details") {
              const detailNode = nodes[0];
              const [summaryNode] = detailNode.content || [];
              const summaryContent = summaryNode?.content?.map((n, k) =>
                renderNode(n, k)
              );

              // 바로 다음 세그먼트를 본문으로 사용
              const nextBody = segments[i + 1] || [];
              const detailBody = nextBody.map((n, k) => renderNode(n, k));

              // 순번 계산 (기존 로직 그대로)
              const detailNumber =
                segments
                  .slice(0, i)
                  .filter(
                    (seg) => seg.length === 1 && seg[0].type === "details"
                  ).length + 1;
              elements.push(
                <details key={i} className="wiki-viewer__section" open>
                  <summary className="flex font-27-700 cursor-pointer">
                    <p className="text-[var(--blue)]">{detailNumber}.</p>&nbsp;
                    {summaryContent}
                  </summary>
                  <hr className="border-[#CCC] mt-[5px] mb-[21px]" />
                  <div className="wiki-viewer__section-body">{detailBody}</div>
                </details>
              );

              // 이미 이 '본문'을 detail 안에 넣었으니, map 건너뛰기
              i++;
              continue;
            }
            // ② 일반 세그먼트
            elements.push(
              <div className="wiki-viewer__segment" key={i}>
                {nodes.map((n, k) => renderNode(n, k))}
              </div>
            );
          }
          return elements;
        })()}
      </div>

      {footnotes.length > 0 && (
        <footer className="footnotes">
          <hr className="my-[30px] border-[#8A8A8E]" />
          <ol>
            {footnotes.map((fn, index) => (
              <li key={fn.id} id={`fn-${fn.id}`} className="flex gap-1">
                <p className="text-[var(--blue)]">[{index + 1}]</p>
                {fn.content.map((node, index) => renderNode(node, index))}
              </li>
            ))}
          </ol>
        </footer>
      )}
    </section>
  );
}
