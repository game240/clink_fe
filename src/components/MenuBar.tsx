import type { Editor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, StrikeIcon } from "../assets/editor/EditorIcons";
import axiosClient from "../apis/axiosClient";
import { v4 as uuidv4 } from "uuid";

const MenuBar = ({
  editor,
  isFootnote,
}: {
  editor: Editor | null;
  isFootnote: boolean;
}) => {
  if (!editor) return null;

  const insertExternalLink = () => {
    // 1) 초록색 스타일로 []() 삽입 → 2) 텍스트 스타일 언마크 → 3) 커서 괄호 안으로 이동
    editor
      .chain()
      .focus()

      .insertContent({ type: "bracket", attrs: { type: "open" } })

      .insertContent([{ type: "text", text: "텍스트" }])

      .insertContent({ type: "bracket", attrs: { type: "close" } })

      .insertContent({ type: "paren", attrs: { type: "open" } })

      .insertContent([{ type: "text", text: "외부 링크" }])

      .insertContent({ type: "paren", attrs: { type: "close" } })
      .run();

    editor.view.dispatch(editor.state.tr.setStoredMarks([]));

    const { to } = editor.state.selection; // to는 방금 삽입된 끝 위치
    editor
      .chain()
      .focus()
      .setTextSelection(to) // ')' 바로 앞 자리에 커서 고정
      .run();
  };

  const insertFootnote = () => {
    const id = uuidv4();
    editor
      .chain()
      .focus()
      .insertContent({
        type: "footnotePlaceholder",
        attrs: {
          id, // 고유 ID
          content: [], // 초기 각주 내용은 빈 배열
        },
      })
      .run();
  };

  const insertInternalLink = () => {
    editor
      .chain()
      .focus()
      .insertContent({ type: "blueBracket", attrs: { type: "open" } })

      .insertContent([{ type: "text", text: "내부 링크" }])

      .insertContent({ type: "blueBracket", attrs: { type: "close" } })
      .run();
  };

  // 문단 제목
  const insertParagraph = () => {
    editor
      .chain()
      .focus()
      .insertContent({ type: "equals", attrs: { type: "open" } })
      .insertContent([{ type: "text", text: "문단 제목" }])
      .insertContent({ type: "equals", attrs: { type: "close" } })
      .run();
  };

  // const insertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     // reader.result 에 base64 문자열이 들어있음
  //     editor
  //       .chain()
  //       .focus()
  //       .setImage({ src: reader.result as string })
  //       .run();
  //   };
  //   reader.readAsDataURL(file);
  // };
  const insertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // 1. Insert placeholder image to show skeleton immediately
    editor.chain().focus().setImage({ src: "" }).run();
    editor.view.dispatch(editor.state.tr.setStoredMarks([]));

    // 2. Upload file in background
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const filePath: string = uploadRes.data.path;

    // 3. Update the inserted image's src attribute to actual path
    editor.chain().focus().updateAttributes("image", { src: filePath }).run();
  };

  return (
    <div className="flex items-center justify-end gap-[28px] mb-2 typo-text-md-b">
      <button
        className="cursor-pointer"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().toggleBold().run()}
      >
        <BoldIcon color={editor.isActive("bold") ? "black" : ""} />
      </button>
      <button
        className="cursor-pointer"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().toggleStrike().run()}
      >
        <StrikeIcon color={editor.isActive("strike") ? "black" : ""} />
      </button>
      <button
        className="cursor-pointer"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().toggleItalic().run()}
      >
        <ItalicIcon color={editor.isActive("italic") ? "black" : ""} />
      </button>
      <button
        className="cursor-pointer disabled:text-[#CCC] disabled:cursor-default"
        onClick={insertFootnote}
        disabled={isFootnote}
      >
        각주
      </button>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload-input"
        onClick={(event) => {
          // 같은 사진 업로드 가능화
          (event.currentTarget as HTMLInputElement).value = "";
        }}
        onChange={insertImage}
        disabled={isFootnote}
      />

      <button
        className="cursor-pointer disabled:text-[#CCC] disabled:cursor-default"
        disabled={isFootnote}
      >
        <label
          htmlFor="image-upload-input"
          className={isFootnote ? "cursor-default" : "cursor-pointer"}
        >
          이미지
        </label>
      </button>

      <button className="cursor-pointer" onClick={insertExternalLink}>
        외부 링크
      </button>
      <button className="cursor-pointer" onClick={insertInternalLink}>
        위키 링크
      </button>
      <button
        className="text-primary-04 cursor-pointer disabled:text-[#CCC] disabled:cursor-default"
        onClick={insertParagraph}
        disabled={isFootnote}
      >
        문단 추가
      </button>
    </div>
  );
};

export default MenuBar;
