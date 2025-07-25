import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/animeService";
import "./profile.page.sass";

const ProfilePage = () => {
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-card">
          <div className="avatar">{initial}</div>
          <h2>{user.name}</h2>
          {/* {user.email && <p className="email">{user.email}</p>} */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
