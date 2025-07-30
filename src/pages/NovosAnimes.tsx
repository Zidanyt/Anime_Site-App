import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

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

const NovosAnimes = () => {
  const [newAnimes, setNewAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    async function fetchNewAnimes() {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/animes/new`
        );

        setNewAnimes(res.data);
      } catch (err: any) {
        console.error("Erro ao carregar novos animes:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Erro na requisição");
        } else {
          setError(err.message || "Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNewAnimes();
  }, [user]);

  if (loading) return <p>Carregando novos animes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (newAnimes.length === 0) return <p>Não há animes novos no momento.</p>;

  return (
    <div className="novos-animes-page">
      <h1>Animes Novos</h1>
      <ul className="anime-list">
        {newAnimes.map((anime) => (
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
              <h3>
                {anime.title || "Título indisponível"}
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Novo
                </span>
              </h3>
              <p>{anime.description || "Sem descrição disponível."}</p>
              {anime.author && <p><strong>Autor:</strong> {anime.author}</p>}
              {anime.studio && <p><strong>Estúdio:</strong> {anime.studio}</p>}
              {anime.releaseDate && (
                <p>
                  <strong>Lançamento:</strong>{" "}
                  {new Date(anime.releaseDate).toLocaleDateString()}
                </p>
              )}
              {anime.status && <p><strong>Status:</strong> {anime.status}</p>}
              {anime.episodesCount !== undefined && (
                <p><strong>Episódios:</strong> {anime.episodesCount}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NovosAnimes;
