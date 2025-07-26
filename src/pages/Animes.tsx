import { useEffect, useState } from "react";
import {
  getAnimes,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  rateAnime,
} from "../services/animeService";
import "../styles/Animes.scss";

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
  const [loading, setLoading] = useState<boolean>(true); // <- estado de carregamento

useEffect(() => {
  async function loadData() {
    try {
      const animesData = await getAnimes();
      const favData = await getFavorites();
      const favoriteIds = favData.map((anime: Anime) => anime.id); // <-- aqui
      setAnimes(animesData);
      setFavorites(favoriteIds);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []);


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
      const updatedAnimes = await getAnimes();
      setAnimes(updatedAnimes);
    } catch (error) {
      console.error("Erro ao avaliar anime:", error);
    }
  };

  if (loading) {
    return <div className="loading-overlay">
        <img
          src="https://th.bing.com/th/id/R.cd6d5c805f8c007014915f8ef14c926e?rik=quzehtmYo8yE8g&riu=http%3a%2f%2fpa1.narvii.com%2f6909%2fc92d8f3b7babc938ab6686671f207a33c56e3e35r1-500-719_00.gif&ehk=Vd1zHGb3837Rjhpt2Yst23joQvyQGSGRp9%2fFqB6gD%2fg%3d&risl=&pid=ImgRaw&r=0"
          alt="Carregando..."
          className="loading-gif"
          loading="lazy" 
        />
      </div>
  } 

  return (
    <div className="animes-page">
      <h1>Animes</h1>
      <div className="anime-list">
        {animes.map((anime) => {
          const isFav = favorites.includes(anime.id);
          const avgRating =
            anime.ratings && anime.ratings.length > 0
              ? anime.ratings.reduce((sum, r) => sum + r.score, 0) / anime.ratings.length
              : 0;
          const hovered = hoveredStars[anime.id] || 0;

          return (
            <div key={anime.id} className="anime-card">
              <img loading="lazy"  src={anime.image} alt={anime.title} />
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
