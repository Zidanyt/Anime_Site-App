import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const API_URL = `${BASE_URL}/api/animes`;
const FAVORITES_URL = `${BASE_URL}/api/favorites`;
const RATINGS_URL = `${BASE_URL}/api/ratings`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token de autenticação não encontrado");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAnimes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addToFavorites = async (animeId: string) => {
  await axios.post(`${FAVORITES_URL}/${animeId}`, {}, getAuthHeader());
};

export const removeFromFavorites = async (animeId: string) => {
  await axios.delete(`${FAVORITES_URL}/${animeId}`, getAuthHeader());
};

export const getFavorites = async () => {
  const response = await axios.get(FAVORITES_URL, getAuthHeader());
  return response.data;
};

export const rateAnime = async (animeId: string, score: number) => {
  const response = await axios.post(
    `${RATINGS_URL}`,
    { animeId, score },
    getAuthHeader()
  );
  return response.data;
};


export const registerUser = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/api/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/api/login`, {
    email,
    password,
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axios.get(`${BASE_URL}/api/auth/profile`, getAuthHeader());
  return response.data;
};

export const getTop10Animes = async () => {
  const response = await axios.get(`${RATINGS_URL}/top10`, getAuthHeader());
  return response.data;
};

export const getNewAnimes = async () => {
  const response = await axios.get(`${API_URL}/new`);
  return response.data;
};