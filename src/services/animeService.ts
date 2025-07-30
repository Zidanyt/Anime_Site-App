import api from "./axiosInstance";

const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");
const API_URL = `${BASE_URL}/api/animes`;
const FAVORITES_URL = `${BASE_URL}/api/favorites`;
const RATINGS_URL = `${BASE_URL}/api/ratings`;

export const getAnimes = async () => {
  const response = await api.get("/api/animes");
  return response.data;
};

export const addToFavorites = async (animeId: string) => {
  await api.post(`/api/favorites/${animeId}`);
};

export const removeFromFavorites = async (animeId: string) => {
  await api.delete(`/api/favorites/${animeId}`);
};

export const getFavorites = async () => {
  const response = await api.get("/api/favorites");
  return response.data;
};

export const rateAnime = async (animeId: string, score: number) => {
  const response = await api.post("/api/ratings", { animeId, score });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await api.post("/api/register", {
    name,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/api/login", {
    email,
    password,
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/api/auth/profile");
  return response.data;
};

export const getTop10Animes = async () => {
  const response = await api.get("/api/ratings/top10");
  return response.data;
};

export const getNewAnimes = async () => {
  const response = await api.get("/api/animes/new");
  return response.data;
};
