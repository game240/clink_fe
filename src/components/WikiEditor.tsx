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
import { useLocation } from "react-router-dom";
import { AxiosError } from "axios";

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
  const { pathname } = useLocation(); // e.g. "/edit/광운대학교/광운극예술연구회"
  const raw = pathname.replace(/^\/edit\//, ""); // "광운대학교/광운극예술연구회"
  const title = decodeURI(raw);

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

        const { data } = await axiosClient.get(`/page?title=${encodedTitle}`);
        setMeta(data.meta);
        setInitialContent(data.content);
        console.log(data);
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
  }, [title]);

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
        title,
        content,
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
    <div>
      <div className="flex items-end gap-[12px] mb-[49px]">
        <h1 className="font-36-700">{title}</h1>
        <p className="font-28-700">
          {meta && `(v${meta.current_rev_number + 1})`}
        </p>
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
  );
}
