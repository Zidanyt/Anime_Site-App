import axios from "axios";

const API_URL = "http://localhost:5000/api/animes";
const FAVORITOS_URL = "http://localhost:5000/api/favorites";
const RATINGS_URL = "http://localhost:5000/api/ratings";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAnimes = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const addToFavorites = async (animeId: string) => {
  await axios.post(`${FAVORITOS_URL}/${animeId}`, {}, getAuthHeader());
};

export const removeFromFavorites = async (animeId: string) => {
  await axios.delete(`${FAVORITOS_URL}/${animeId}`, getAuthHeader());
};

export const getFavorites = async () => {
  const response = await axios.get(FAVORITOS_URL, getAuthHeader());
  return response.data;
};

export const rateAnime = async (animeId: string, score: number) => {
  const response = await axios.post(`${RATINGS_URL}/${animeId}`, { score }, getAuthHeader());
  return response.data;
};
