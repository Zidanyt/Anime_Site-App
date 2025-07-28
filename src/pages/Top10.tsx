import { useEffect, useState } from "react";
import "../styles/Animes.scss"; // ou crie um `Top10.scss` separado se preferir

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

interface TopRatedAnime {
  anime: Anime;
  average: number;
  totalRatings: number;
}

const Top10 = () => {
  const [topAnimes, setTopAnimes] = useState<TopRatedAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop10() {
      try {
        const res = await fetch("http://localhost:5000/api/ratings/top10");
        const data = await res.json();
        setTopAnimes(data);
      } catch (err) {
        console.error("Erro ao buscar Top 10:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTop10();
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <img
          src="https://th.bing.com/th/id/R.cd6d5c805f8c007014915f8ef14c926e?rik=quzehtmYo8yE8g&riu=http%3a%2f%2fpa1.narvii.com%2f6909%2fc92d8f3b7babc938ab6686671f207a33c56e3e35r1-500-719_00.gif"
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
        {topAnimes.map(({ anime, average, totalRatings }) => (
          <div key={anime.id} className="anime-card">
            <img loading="lazy" src={anime.image} alt={anime.title} />
            <div className="anime-info">
              <h3>{anime.title}</h3>
              <p><strong>Descrição:</strong> {anime.description}</p>
              <p><strong>Média:</strong> {average.toFixed(1)} / 5 ({totalRatings} avaliações)</p>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`star ${n <= Math.round(average) ? "filled" : ""}`}>★</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top10;
