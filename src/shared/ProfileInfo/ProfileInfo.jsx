import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main.jsx";
import "./ProfileInfo.scss";

const ProfileInfo = observer(() => {
  const { userStore } = useContext(Context);
  const user = userStore.user;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userStore.logout();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <div className="profile-info">
      <div className="avatar-wrapper">
        {user.avatar ? (
          <img src={user.avatar} alt="Аватар" className="avatar" />
        ) : (
          <div className="avatar-placeholder">
            {user.name?.[0] || "?"}
          </div>
        )}
      </div>

      <div className="info">
        <h3 className="username">{user.name} {user.surName}</h3>
        <div className="field"><strong>Телефон:</strong> {user.number}</div>
        <div className="field"><strong>Email:</strong> {user.email || "не указан"}</div>
        <button className="logout-button" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
});

export default ProfileInfo;
