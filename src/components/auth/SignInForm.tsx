// src/components/SigninForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../libs/supabaseClient";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "auto" }}>
      <h2>로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "로딩..." : "로그인"}
      </button>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
      <p style={{ marginTop: 8 }}>
        계정이 없으신가요? <a href="/signup">회원가입</a>
      </p>
    </form>
  );
}
