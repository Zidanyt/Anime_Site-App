import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/animeService";

interface LoginProps {
  onLogin: (user: { id: string; name: string; email: string }) => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      // Seu backend retorna { token, user }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onLogin(res.user);
      navigate("/");
    } catch {
      alert("Login falhou");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
      <p>
        Não tem uma conta? <Link to="/register">Registre-se</Link>
      </p>
    </form>
  );
}

export default Login;
