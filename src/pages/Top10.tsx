import { useEffect, useState } from "react";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  rateAnime,
} from "../services/animeService";
import axios from "axios";
import "../styles/Animes.scss";
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

interface TopAnime {
  anime: Anime;
  average: number;
  totalRatings: number;
}

const Top10 = () => {
  const [topAnimes, setTopAnimes] = useState<TopAnime[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredStars, setHoveredStars] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    async function loadTop10() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/ratings/top10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopAnimes(res.data);

        const favData = await getFavorites();
        const favIds = favData.map((anime: Anime) => anime.id);
        setFavorites(favIds);
      } catch (err) {
        console.error("Erro ao carregar top 10 animes:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTop10();
  }, [user]);

  const toggleFavorite = async (animeId: string) => {
    try {
      if (favorites.includes(animeId)) {
        await removeFromFavorites(animeId);
        setFavorites((prev) => prev.filter((id) => id !== animeId));
      } else {
        await addToFavorites(animeId);
        setFavorites((prev) => [...prev, animeId]);
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
    }
  };

  const handleRating = async (animeId: string, score: number) => {
    try {
      await rateAnime(animeId, score);
      const updated = await axios.get(
        `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/ratings/top10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTopAnimes(updated.data);
    } catch (error) {
      console.error("Erro ao avaliar anime:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <img
          src="https://th.bing.com/th/id/R.cd6d5c805f8c007014915f8ef14c926e?rik=quzehtmYo8yE8g&riu=http%3a%2f%2fpa1.narvii.com%2f6909%2fc92d8f3b7babc938ab6686671f207a33c56e3e35r1-500-719_00.gif&ehk=Vd1zHGb3837Rjhpt2Yst23joQvyQGSGRp9%2fFqB6gD%2fg%3d&risl=&pid=ImgRaw&r=0"
          alt="Carregando..."
          className="loading-gif"
        />
      </div>
    );
  }

  return (
    <div className="animes-page">
      <h1>Top 10 Animes Mais Bem Avaliados</h1>
      <div className="anime-list">
        {topAnimes.map(({ anime, average }) => {
          const isFav = favorites.includes(anime.id);
          const hovered = hoveredStars[anime.id] || 0;
          const avgRating = average;

          return (
            <div key={anime.id} className="anime-card">
              <img loading="lazy" src={anime.image} alt={anime.title} />
              <div className="anime-info">
                <h3>{anime.title}</h3>
                <p><strong>Descrição:</strong> {anime.description}</p>
                <p><strong>Autor:</strong> {anime.author || "Desconhecido"}</p>
                <p><strong>Estúdio:</strong> {anime.studio || "Desconhecido"}</p>
                <p><strong>Status:</strong> {anime.status || "?"}</p>
                <p><strong>Episódios:</strong> {anime.episodesCount ?? "?"}</p>
                <p><strong>Lançamento:</strong> {anime.releaseDate ? new Date(anime.releaseDate).toLocaleDateString() : "?"}</p>
                <p><strong>Média:</strong> {avgRating.toFixed(1)} / 5</p>

                <button
                  className={`favorite-button ${isFav ? "remove" : "add"}`}
                  onClick={() => toggleFavorite(anime.id)}
                >
                  {isFav ? "💚 Desfavoritar" : "❤️ Favoritar"}
                </button>

                <div className="rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`star ${n <= (hovered || avgRating) ? "filled" : ""}`}
                      onClick={() => handleRating(anime.id, n)}
                      onMouseEnter={() =>
                        setHoveredStars((prev) => ({ ...prev, [anime.id]: n }))
                      }
                      onMouseLeave={() =>
                        setHoveredStars((prev) => ({ ...prev, [anime.id]: 0 }))
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Top10;
