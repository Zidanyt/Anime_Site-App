// src/context/SearchContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

interface SearchContextType {
  termo: string;
  setTermo: (value: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  termo: "",
  setTermo: () => {},
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [termo, setTermo] = useState("");
  return (
    <SearchContext.Provider value={{ termo, setTermo }}>
      {children}
    </SearchContext.Provider>
  );
};
