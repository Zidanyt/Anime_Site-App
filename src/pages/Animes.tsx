import { useEffect, useState } from "react";
import {
  getAnimes,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  rateAnime,
} from "../services/animeService";
import "../styles/Animes.scss"; // ⬅️ Certifique-se de importar o Sass aqui

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
  ratings?: { score: number }[];
}

const Animes = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredStars, setHoveredStars] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animeList, favs] = await Promise.all([getAnimes(), getFavorites()]);
        setAnimes(animeList);
        setFavorites(favs.map((f: any) => f.id));
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = async (animeId: string) => {
    if (favorites.includes(animeId)) {
      await removeFromFavorites(animeId);
      setFavorites(favorites.filter((id) => id !== animeId));
    } else {
      await addToFavorites(animeId);
      setFavorites([...favorites, animeId]);
    }
  };

  const handleRating = async (animeId: string, score: number) => {
    await rateAnime(animeId, score);
    const updated = await getAnimes();
    setAnimes(updated);
  };

  return (
    <div className="animes-page">
      <h1>Animes</h1>
      <div className="anime-list">
        {animes.map((anime) => {
          const isFav = favorites.includes(anime.id);
          const averageRating =
            anime.ratings && anime.ratings.length > 0
              ? anime.ratings.reduce((acc, r) => acc + r.score, 0) / anime.ratings.length
              : 0;

          const hovered = hoveredStars[anime.id] || 0;

          return (
            <div key={anime.id} className="anime-card">
              <img src={anime.image} alt={anime.title} />
              <div className="anime-info">
                <h3>{anime.title}</h3>
                <p><strong>Descrição:</strong> {anime.description}</p>
                <p><strong>Autor:</strong> {anime.author || "Desconhecido"}</p>
                <p><strong>Estúdio:</strong> {anime.studio || "Desconhecido"}</p>
                <p><strong>Status:</strong> {anime.status || "?"}</p>
                <p><strong>Episódios:</strong> {anime.episodesCount ?? "?"}</p>
                <p><strong>Lançamento:</strong> {anime.releaseDate ? new Date(anime.releaseDate).toLocaleDateString() : "?"}</p>
                <p><strong>Média:</strong> {averageRating.toFixed(1)} / 5</p>

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
                      className={`star ${n <= (hovered || averageRating) ? "filled" : ""}`}
                      onClick={() => handleRating(anime.id, n)}
                      onMouseEnter={() => setHoveredStars((prev) => ({ ...prev, [anime.id]: n }))}
                      onMouseLeave={() => setHoveredStars((prev) => ({ ...prev, [anime.id]: 0 }))}
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

export default Animes;
