import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/animeService";

interface RegisterProps {
  onRegister: (user: { id: string; name: string; email: string }) => void;
}

function Register({ onRegister }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Note: Seu backend retorna só message e user, sem token no registro
      const res = await registerUser(name, email, password);

      // Você pode exigir login após registro ou modificar backend pra retornar token
      // Aqui vamos fazer login automático após registro, então chamamos loginUser novamente:
      // Alternativamente, peça para o usuário fazer login depois do registro

      alert("Usuário registrado com sucesso! Faça login.");

      navigate("/login");
    } catch {
      alert("Registro falhou");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar</h2>
      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button type="submit">Registrar</button>
      <p>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </form>
  );
}

export default Register;
