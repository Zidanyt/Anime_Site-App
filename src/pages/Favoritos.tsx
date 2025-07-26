import { useEffect, useState } from "react";
import axios from "axios";

interface Anime {
  id: string;
  title: string;
  description: string;
  image: string;
  // Se quiser, pode adicionar outros campos opcionais aqui:
  author?: string;
  studio?: string;
  releaseDate?: string;
  status?: string;
  episodesCount?: number;
}

const Favoritos = () => {
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Já é um array direto de animes:
        const favoritesList: Anime[] = res.data;

        setFavorites(favoritesList);
      } catch (err: any) {
        console.error("Erro ao carregar favoritos:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Erro na requisição");
        } else {
          setError(err.message || "Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) return <p>Carregando favoritos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (favorites.length === 0) return <p>Você não tem favoritos ainda.</p>;

  return (
    <div className="favoritos-page">
      <h1>Seus Animes Favoritos</h1>
      <ul className="anime-list">
        {favorites.map((anime) => (
          <li key={anime.id} className="anime-item">
            <img
              src={anime.image || "/no-image.png"}
              alt={anime.title || "Anime sem título"}
              width={200}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/no-image.png";
              }}
            />
            <div className="anime-info">
              <h3>{anime.title || "Título indisponível"}</h3>
              <p>{anime.description || "Sem descrição disponível."}</p>
              {/* Opcional: mostrar mais detalhes */}
              {anime.author && <p><strong>Autor:</strong> {anime.author}</p>}
              {anime.studio && <p><strong>Estúdio:</strong> {anime.studio}</p>}
              {anime.releaseDate && <p><strong>Lançamento:</strong> {new Date(anime.releaseDate).toLocaleDateString()}</p>}
              {anime.status && <p><strong>Status:</strong> {anime.status}</p>}
              {anime.episodesCount !== undefined && <p><strong>Episódios:</strong> {anime.episodesCount}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favoritos;
