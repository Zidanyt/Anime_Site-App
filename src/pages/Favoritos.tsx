import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useSearch } from "../../SearchContext";

interface Anime {
  id: string;
  title: string;
  description: string;
  image: string;
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
  const { user } = useAuth();
  const { termo } = useSearch();

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
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

        setFavorites(res.data);
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
    };

    fetchFavorites();
  }, [user]);

  // 🔍 Filtro baseado no termo da busca
  const favoritosFiltrados = favorites.filter((anime) =>
    anime.title.toLowerCase().includes(termo.toLowerCase())
  );

  if (loading) return <p>Carregando favoritos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (favorites.length === 0) return <p>Você não tem favoritos ainda.</p>;

  return (
    <div className="favoritos-page">
      <h1>Seus Animes Favoritos</h1>

      {favoritosFiltrados.length === 0 ? (
        <p style={{ marginTop: "1rem", fontStyle: "italic", color: "#888" }}>
          Nenhum anime encontrado com esse título.
        </p>
      ) : (
        <ul className="anime-list">
          {favoritosFiltrados.map((anime) => (
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
                {anime.author && <p><strong>Autor:</strong> {anime.author}</p>}
                {anime.studio && <p><strong>Estúdio:</strong> {anime.studio}</p>}
                {anime.releaseDate && (
                  <p><strong>Lançamento:</strong> {new Date(anime.releaseDate).toLocaleDateString()}</p>
                )}
                {anime.status && <p><strong>Status:</strong> {anime.status}</p>}
                {anime.episodesCount !== undefined && (
                  <p><strong>Episódios:</strong> {anime.episodesCount}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favoritos;
