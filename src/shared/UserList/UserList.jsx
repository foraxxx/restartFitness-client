import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserList.scss";

const UserList = ({ usersList }) => {
  const navigate = useNavigate();

  if (!usersList) {
    return <div>Нет данных пользователей</div>;
  }

  if (usersList.length === 0) {
    return <div>Пользователи не найдены</div>;
  }

  return (
    <div className="user-list">
      <ul className="user-list__items">
        {usersList.map((user) => (
          <li
            key={user.id}
            className="user-card"
            onClick={() => navigate(`/adminPanel/user/${user.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="user-card__avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.surName} ${user.name}`} />
              ) : (
                <div className="user-card__avatar-placeholder">
                  {user.surName?.[0]}
                  {user.name?.[0]}
                </div>
              )}
            </div>
            <div className="user-card__info">
              <h3 className="user-card__name">
                {user.surName} {user.name}
              </h3>
              <p className="user-card__role">{user.Role?.name || "Нет роли"}</p>
              <p className="user-card__number">📱 {user.number}</p>
              {user.email && (
                <p className="user-card__email">✉️ {user.email}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
