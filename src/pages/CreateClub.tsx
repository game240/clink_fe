import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../apis/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";

type CreateClubResponse = {
  club: {
    id: string;
    name: string;
    description: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
  membership: {
    club_id: string;
    profile_id: string;
    role: string;
    status: string;
    officer_title: string | null;
    joined_at: string;
    ord: number;
  };
};

const CreateClub = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError("동아리 이름을 입력하세요.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axiosClient.post<CreateClubResponse>("/club", {
        name: trimmed,
        description: description.trim() || undefined,
        profile_id: user.id,
      });
      console.log(data);
      setSuccess("동아리가 생성되었습니다.");
      setName("");
      setDescription("");
      setTimeout(() => {
        navigate("/organizations");
      }, 700);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.error || error.message);
      } else {
        setError("오류가 발생했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main>로딩 중…</main>;
  }

  if (!user) {
    return (
      <main>
        <h1 className="font-27-700">동아리 생성</h1>
        <p className="mt-[12px] font-15-400">
          이 기능을 사용하려면 로그인이 필요합니다.
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1 className="font-27-700">동아리 생성</h1>
      <form className="mt-[16px] max-w-[560px]" onSubmit={onSubmit}>
        <label className="block mb-[8px] font-15-700" htmlFor="club-name">
          동아리 이름
        </label>
        <input
          id="club-name"
          type="text"
          className="w-full h-[40px] px-[12px] rounded-[6px] border-1 border-[#CCC] font-15-400"
          placeholder="예) 포도연극동아리"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <label
          className="block mt-[16px] mb-[8px] font-15-700"
          htmlFor="club-desc"
        >
          설명 (선택)
        </label>
        <textarea
          id="club-desc"
          className="w-full min-h-[120px] p-[12px] rounded-[6px] border-1 border-[#CCC] font-15-400"
          placeholder="동아리에 대한 간단한 소개를 작성하세요."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        {error && (
          <p className="mt-[12px] text-[var(--red)] font-14-400">{error}</p>
        )}
        {success && (
          <p className="mt-[12px] text-[var(--blue)] font-14-400">{success}</p>
        )}

        <div className="mt-[20px] flex gap-[8px]">
          <button
            type="submit"
            className="px-[14px] h-[36px] rounded-[6px] bg-[var(--blue)] text-white font-15-700 disabled:opacity-50"
            disabled={submitting || name.trim().length === 0}
          >
            {submitting ? "생성 중…" : "생성하기"}
          </button>
          <button
            type="button"
            className="px-[14px] h-[36px] rounded-[6px] border-1 border-[#CCC] font-15-700"
            onClick={() => {
              navigate(-1);
            }}
          >
            취소
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateClub;
