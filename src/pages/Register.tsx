import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface RegisterProps {
  onRegister: (user: { name: string; email: string }) => void;
}

function Register({ onRegister }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onRegister(res.data.user);
      navigate("/");
    } catch (err) {
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
