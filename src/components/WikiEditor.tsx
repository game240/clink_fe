import {
  useEditor,
  EditorContent,
  type Editor,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import LinkExtension from "@tiptap/extension-link";
import { FootnotePlaceholder } from "../extensions/FootnotePlaceholder";
import { BracketExit } from "../extensions/brackets/BracketExit";
import { LineNumbers } from "../extensions/LineNumbers";
import { CompositionGuard } from "../extensions/CompositionGuard";
import { ClearStoredMarks } from "../extensions/ClearStoredMark";
import { Bracket, BlueBracket } from "../extensions/brackets/Bracket";
import { Paren } from "../extensions/brackets/Paren";
import { Equals } from "../extensions/brackets/Equals";
import { ImageWithProxy } from "../extensions/ImageWithProxy";
import MenuBar from "./MenuBar";
import { useEffect, useState, useMemo } from "react";
import axiosClient from "../apis/axiosClient";
import FootnoteEditor from "./FootnoteEditor";
import { useLocation, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import AsideLayoutTopNav from "./aside/AsideLayoutTopNav";
import PageBlock from "./PageBlock";
import RightPageBlockContent from "./RightPageBlockContent";

interface FootnoteItem {
  id: string;
  content: JSONContent[];
}

interface Meta {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  current_rev: string;
  current_rev_number: number;
}

export default function WikiEditor() {
  const location = useLocation(); // e.g. "/edit/광운대학교/광운극예술연구회"
  const raw = location.pathname.replace(/^\/edit\//, ""); // "광운대학교/광운극예술연구회"
  const title = decodeURI(raw);

  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const wikiTypeFromQuery = searchParams.get("wikiType");

  const { isPublic: isPublicFromLocation } = location.state || {};
  const [isPublic, setIsPublic] = useState(isPublicFromLocation || false);
  const [wikiType, setWikiType] = useState(wikiTypeFromQuery || "work");

  const [initialContent, setInitialContent] = useState<JSONContent[] | null>(
    null
  );
  const [meta, setMeta] = useState<Meta | null>(null);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  // Main editor instance
  const mainEditor = useEditor({
    extensions: [
      CompositionGuard,
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      ImageWithProxy.configure({ inline: false, allowBase64: true }),
      Bracket,
      BlueBracket,
      Paren,
      Equals,
      ClearStoredMarks,
      LinkExtension.configure({ HTMLAttributes: { class: "wiki-link" } }),
      // InternalLinkPlaceholder,
      FootnotePlaceholder,
      BracketExit,
      LineNumbers,
    ],
    content: initialContent || "",
    onCreate: ({ editor }) => {
      editor.on("focus", () => setActiveEditor(editor));
    },
  });

  // Extract footnotes from the main document
  const footnotes = useMemo<FootnoteItem[]>(() => {
    if (!mainEditor) return [];
    const items: FootnoteItem[] = [];
    mainEditor.state.doc.descendants((node) => {
      if (node.type.name === "footnotePlaceholder") {
        items.push({
          id: node.attrs.id,
          content: node.attrs.content as JSONContent[],
        });
      }
    });
    return items;
  }, [mainEditor?.state.doc]);

  // // Load initial page content
  // useEffect(() => {
  //   axiosClient.get(`/page/page1.json`).then(({ data }) => {
  //     setInitialContent(data.content);
  //   });
  // }, []);

  useEffect(() => {
    if (!title) return;

    const loadPage = async () => {
      try {
        const encodedTitle = encodeURI(title);

        const { data } = await axiosClient.get(
          `/page?clubId=${clubId}&title=${encodedTitle}`
        );
        setMeta(data.meta);
        setInitialContent(data.content);
        setIsPublic(data.meta.is_public);
        setWikiType(data.meta.is_knowhow === true ? "knowhow" : "work");
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setInitialContent(null);
          } else {
            console.error(error);
            alert("페이지 로드에 실패했습니다.");
          }
        } else {
          console.error(error);
          alert("페이지 로드에 실패했습니다.");
        }
      }
    };

    loadPage();
  }, [clubId, title]);

  // Set content when fetched
  useEffect(() => {
    if (mainEditor && initialContent) {
      mainEditor.commands.setContent(initialContent);
    }
  }, [mainEditor, initialContent]);

  // Update footnote content in main editor
  const updateFootnoteContent = (id: string, newContent: JSONContent[]) => {
    if (!mainEditor) return;
    const { state, view } = mainEditor;
    // 1) 새로운 트랜잭션 생성
    let tr = state.tr;
    // 2) 문서 전체를 순회하며 해당 각주 노드 위치를 찾아 attrs 업데이트
    state.doc.descendants((node, pos) => {
      if (node.type.name === "footnotePlaceholder" && node.attrs.id === id) {
        tr = tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          content: newContent,
        });
      }
    });
    // 3) 변경이 있었다면 뷰에 디스패치
    if (tr.docChanged) {
      view.dispatch(tr);
    }
  };

  // Save handler
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // const handleSave = async () => {
  //   if (!mainEditor) return;
  //   setSaving(true);
  //   try {
  //     const doc = mainEditor.getJSON();
  //     const res = await axiosClient.post("/save", {
  //       filename: "page1.json",
  //       content: doc,
  //       meta: {
  //         title: "My Wiki Page",
  //         updatedAt: new Date().toISOString(),
  //         author: "junhyeok",
  //       },
  //     });
  //     setMessage(`✅ 저장 성공: ${res.data.path}`);
  //   } catch (error) {
  //     setMessage(`❌ 저장 실패: ${(error as Error).message}`);
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  const handleSave = async () => {
    if (!mainEditor) return;
    setSaving(true);
    try {
      const content = mainEditor.getJSON();
      await axiosClient.post("/page", {
        clubId,
        title,
        content,
        isPublic,
        wikiType,
        // summary: '본문 편집',
      });
      setMessage(`✅ 저장 성공: ${title}`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ 저장 실패: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    // PageLayoutV2 그대로
    <section className="mx-auto w-[75.833333333333333333333333333333%]">
      <div className="px-[10px]">
        <AsideLayoutTopNav />
        {/* TopItem */}
        <section className="flex justify-between items-end mt-[-24px] mb-[30px]">
          <h1 className="typo-head-md-b text-gray-09">위키 글쓰기</h1>
          <div className="flex gap-[20px]">
            {meta?.current_rev_number !== 0 && (
              <button className="w-[117px] h-[60px] bg-error rounded-[12px] typo-title-md-b text-white">
                삭제
              </button>
            )}
            <button
              className="w-[117px] h-[60px] bg-primary-04 rounded-[12px] typo-title-md-b text-white cursor-pointer"
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </section>
      </div>
      <main className="flex justify-center gap-[20px]">
        <PageBlock className="flex-1 mb-[200px] min-h-[984px] p-[20px]">
          <div>
            <div className="flex items-end gap-[12px] mb-[20px]">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[12px] py-[18px] px-[20px] w-full bg-card-2 rounded-[12px]">
                  <h1 className="typo-text-lg-b">{title}</h1>
                  <p className="typo-text-md-b">
                    {meta && `(v${meta.current_rev_number + 1})`}
                  </p>
                </div>
              </div>
            </div>
            <MenuBar
              editor={activeEditor}
              isFootnote={activeEditor !== null && activeEditor !== mainEditor}
            />
            <div className="editor-wrapper pl-4">
              {mainEditor && <EditorContent editor={mainEditor} />}
            </div>
            <div className="footnotes-list">
              <hr />
              <h4>각주</h4>
              <ol className="flex flex-col gap-2">
                {footnotes.map((fn, index) => (
                  <li key={fn.id} className="flex items-center gap-2">
                    <span className="text-[#0275D8]">[{index + 1}]</span>
                    <FootnoteEditor
                      id={fn.id}
                      content={fn.content}
                      updateFootnoteContent={updateFootnoteContent}
                      setActiveEditor={setActiveEditor}
                    />
                  </li>
                ))}
              </ol>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className={saving ? "btn-disabled" : "btn-primary"}
              >
                {saving ? "저장 중..." : "페이지 저장"}
              </button>
            </div>
            {message && (
              <p
                className={
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }
              >
                {message}
              </p>
            )}
          </div>
        </PageBlock>
        <div className="flex flex-col gap-[30px]">
          {wikiType === "knowhow" && (
            <PageBlock className="w-[340px] h-[150px] p-[20px]">
              <section className="w-full h-full">
                <div className="flex justify-between items-center px-[15px] w-full h-[58px] bg-card-2 rounded-[12px]">
                  <p className="typo-text-lg-b">공개 설정</p>
                </div>
                <div className="flex gap-[40px] pl-[15px] pt-[27px]">
                  <div className="flex gap-[10px]">
                    <input
                      type="radio"
                      className="cursor-pointer"
                      id="isPublic-true"
                      name="isPublic"
                      value="true"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                    />
                    <label
                      htmlFor="isPublic-true"
                      className="typo-text-lg-m cursor-pointer"
                    >
                      전체 공개
                    </label>
                  </div>
                  <div className="flex gap-[10px]">
                    <input
                      type="radio"
                      className="cursor-pointer"
                      id="isPublic-false"
                      name="isPublic"
                      value="false"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                    />
                    <label
                      htmlFor="isPublic-false"
                      className="typo-text-lg-m cursor-pointer"
                    >
                      운영진 공개
                    </label>
                  </div>
                </div>
              </section>
            </PageBlock>
          )}
          <PageBlock className="w-[340px] h-[274px] p-[20px]">
            <RightPageBlockContent />
          </PageBlock>
        </div>
      </main>
    </section>
  );
}
