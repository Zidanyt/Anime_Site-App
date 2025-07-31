// src/AvatarModal.tsx
import { useState } from "react";

interface AvatarModalProps {
  onClose: () => void;
  onSave: (url: string) => void;
}

const AvatarModal = ({ onClose, onSave }: AvatarModalProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSave(url.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Insira a URL do novo avatar</h3>
        <form onSubmit={handleSubmit}>
          <input
          className="avatar-url-input"
            type="url"
            placeholder="https://exemplo.com/avatar.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvatarModal;
