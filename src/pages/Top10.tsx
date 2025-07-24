import { useEffect, useState } from "react";
import axios from "axios";

interface Anime {
  id: string;
  title: string;
  description: string;
  image: string;
  average: number; // média das notas (já calculada no backend)
}

const Top10 = () => {
  const [topAnimes, setTopAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTop10() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/ratings/top10");
        setTopAnimes(res.data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar Top 10");
      } finally {
        setLoading(false);
      }
    }
    fetchTop10();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="top10-page">
      <h1>Top 10 Animes</h1>
      <ul>
        {topAnimes.map((anime) => (
          <li key={anime.id}>
            <h3>{anime.title}</h3>
            <p>{anime.description}</p>
            <img src={anime.image} alt={anime.title} width={200} />
            <p>Nota média: {anime.average.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Top10;
