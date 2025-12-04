// src/components/SignupForm.tsx
import { useState } from "react";
import { supabase } from "../../libs/supabaseClient";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const redirectTo = window.location.origin + "/auth/callback";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✅ 인증 메일을 보냈습니다. 이메일을 확인해주세요.");

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: data.user?.id, email: email, nickname: email, name: name, phone: phone }]);
      if (profileError) {
        console.error("profiles insert error", profileError);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "auto" }}>
      <h2>회원가입 (이메일 인증)</h2>
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
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="전화번호, 010-1234-5678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "로딩..." : "회원가입"}
      </button>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </form>
  );
}
