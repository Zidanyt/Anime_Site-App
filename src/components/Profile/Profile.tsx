// src/components/Profile/Profile.tsx
import "./profile.component.sass";

interface ProfileProps {
  name: string;
}

const Profile = ({ name }: ProfileProps) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="profile-container"> 
      <div className="profile-initial">{initial}</div>
      <span className="profile-name">{name}</span>
    </div>
  );
};

export default Profile;
