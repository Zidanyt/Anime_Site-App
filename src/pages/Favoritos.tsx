import { useEffect, useState } from "react";
import axios from "axios";

interface Anime {
  id: string;
  title: string;
  description: string;
  image: string;
}

const Favoritos = () => {
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const res = await axios.get("http://localhost:5000/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(res.data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar favoritos");
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) return <p>Carregando favoritos...</p>;
  if (error) return <p>{error}</p>;

  if (favorites.length === 0) return <p>Você não tem favoritos ainda.</p>;

  return (
    <div className="favoritos-page">
      <h1>Seus Favoritos</h1>
      <ul>
        {favorites.map((anime) => (
          <li key={anime.id}>
            <h3>{anime.title}</h3>
            <p>{anime.description}</p>
            <img src={anime.image} alt={anime.title} width={200} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favoritos;
