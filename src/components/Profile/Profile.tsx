// src/components/Profile/Profile.tsx
import "./profile.component.sass";

interface ProfileProps {
  name: string;
  avatarUrl?: string | null;
}

const Profile = ({ name, avatarUrl }: ProfileProps) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="profile-container">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
      ) : (
        <div className="profile-initial">{initial}</div>
      )}
      {/* <span className="profile-name">{name}</span> */}
    </div>
  );
};

export default Profile;
