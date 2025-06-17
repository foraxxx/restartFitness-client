import React from "react";
import styles from "./UserMembershipCard.module.scss";

const UserMembershipCard = ({ membership }) => {
  const { name, dateStart, dateEnd, freezingDays, Status } = membership;

  const statusClassMap = {
    "Активный": styles.active,
    "Запланирован": styles.planned,
    "Заморожен": styles.frozen,
    "Завершён": styles.finished
  };

  return (
    <div className={`${styles.membershipCard} ${statusClassMap[Status?.name] || ""}`}>
      <p><strong>{name}</strong></p>
      <p>С: {new Date(dateStart).toLocaleDateString()}</p>
      <p>По: {new Date(dateEnd).toLocaleDateString()}</p>
      <p>Заморозка: {freezingDays} дн.</p>
      <p>Статус: {Status?.name || "—"}</p>
    </div>
  );
};

export default UserMembershipCard;