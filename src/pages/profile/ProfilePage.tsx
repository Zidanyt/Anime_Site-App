import { useEffect, useState } from "react";
import { getUserProfile, updateAvatar } from "../../services/animeService";
import { useNavigate } from "react-router-dom";
import "./profile.page.sass";
import AvatarModal from "../../../AvatarModal";

interface ProfileProps {}

const ProfilePage: React.FC<ProfileProps> = () => {
  const [user, setUser] = useState<{ name: string; email?: string; avatarUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Carregando perfil...</p>;
  if (!user) return <p>Erro ao carregar dados do usuário.</p>;

  const initial = user.name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveAvatar = async (url: string) => {
    try {
      await updateAvatar(url);
      setUser((prev) => prev ? { ...prev, avatarUrl: url } : prev);
      alert("Avatar atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar");
    }
  };

  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-card">
          <div className="avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="avatar-image" />
            ) : (
              initial
            )}
          </div>
          <h2>{user.name}</h2>
          {user.email && <p className="email">{user.email}</p>}

          <button onClick={() => setShowModal(true)}>Alterar Avatar</button>

          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      {showModal && (
        <AvatarModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveAvatar}
        />
      )}
    </div>
  );
};

export default ProfilePage;
