import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import {Modal, DatePicker, Button, message, QRCode} from "antd"
import moment from "moment";
import "./MyMemberships.scss";
import VisitService from "../../services/VisitService.js"
import { forwardRef } from 'react';

const MyMemberships = observer(forwardRef((props, ref) => {
  const { membershipStore, userMembershipStore } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const memberships = membershipStore.userMemberships.slice().sort((a, b) => {
    const getPriority = (statusName) => {
      switch (statusName) {
        case "Активный":
          return 0;
        case "Заморожен":
          return 1;
        case "Запланирован":
          return 2;
        default:
          return 3;
      }
    };

    const priorityA = getPriority(a.Status.name);
    const priorityB = getPriority(b.Status.name);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Если приоритеты одинаковые — сортируем по дате начала (сначала свежие)
    return new Date(b.dateStart) - new Date(a.dateStart);
  });

  useEffect(() => {
    membershipStore.fetchUserMemberships();
  }, []);

  if (!memberships.length) {
    return <p>У вас пока нет абонементов.</p>;
  }

  const disabledStartDate = (current) => {
    // return current && current < moment().endOf("day");
    return current && current < moment().startOf("day");
  };

  const disabledEndDate = (current) => {
    if (!startDate) return true;
    const minEndDate = startDate.clone().startOf("day").add(7, 'days');
    const maxEndDate = startDate.clone().add(selectedMembership.freezingDays, "days").endOf("day");
    return current && (current < minEndDate || current > maxEndDate);
  };

  const openFreezeModal = (membership) => {
    setSelectedMembership(membership);
    setStartDate(null);
    setEndDate(null);
    setIsModalOpen(true);
  };

  const showQrModal = (membership) => {
    setSelectedMembership(membership);
    setIsModalVisible(true);
  };

  const closeQrModal = () => {
    setIsModalVisible(false);
    setSelectedMembership(null);
  };

  const handleOk = async () => {
    if (!startDate || !endDate) {
      message.error("Пожалуйста, выберите даты начала и окончания заморозки");
      return;
    }

    const start = startDate.toDate();
    const end = endDate.toDate();

    if ((end - start) / (1000 * 3600 * 24) < 7) {
      message.error("Минимальный срок заморозки — 7 дней");
      return;
    }

    try {
      const updatedUserMembership = await userMembershipStore.freezeMembership(selectedMembership.id, start, end);
      await membershipStore.fetchUserMemberships();
      message.success(`Абонемент будет заморожен в период с ${startDate.format('DD.MM.YYYY')} по ${endDate.format('DD.MM.YYYY')}`);
      setIsModalOpen(false);
    } catch (error) {
      message.error("Ошибка при заморозке абонемента: " + error.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleVisit = async (qrCode, type) => {
    try {
      const response = await VisitService.markVisit(qrCode, type);
      alert(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Неизвестная ошибка";
      message.error(errorMessage);
    }
  };

  return (
    <div className="memberships">
      {memberships.map((m, i) => (
        <div className="card" key={m.id} ref={i === 0 ? ref : null}>
          <div className="membership-card" >
            <p className="title">{m.name}</p>
            <p>
              Срок: {new Date(m.dateStart).toLocaleDateString()} —{" "}
              {new Date(m.dateEnd).toLocaleDateString()}
            </p>
            {(m.Status.name === "Активный" || m.Status.name === "Заморожен")
              ? <p>Доступно дней заморозки: {m.freezingDays}</p>
              : null
            }
            <p
              className={`status ${
                m.Status.name === "Активный"
                  ? "active"
                  : m.Status.name === "Запланирован"
                    ? "planned"
                    : m.Status.name === "Заморожен"
                      ? "freezing"
                      : "expired"
              }`}
            >
              {m.Status.name === "Заморожен" && m.UserMembershipFreezings?.length
                ? `Заморожен с ${new Date(m.UserMembershipFreezings.at(-1).dateStart).toLocaleDateString()} по ${new Date(m.UserMembershipFreezings.at(-1).dateEnd).toLocaleDateString()}`
                : m.Status.name}
            </p>
            {m.freezingDays && m.Status.name === "Активный" ? (
              <Button type="primary" onClick={() => {
                openFreezeModal(m)
              }}>
                Заморозить
              </Button>
            ) : null}
          </div>
          {m.Status.name === "Активный"
          ? <QRCode  onClick={() => showQrModal(m)} value={m.qrCode} size={128} bgColor="#ffffff"/>
            : null
          }

        </div>
      ))}

      <Modal
        title={`Заморозка абонемента: ${selectedMembership?.name || ""}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Подтвердить"
        cancelText="Отмена"
      >
        <DatePicker
          disabledDate={disabledStartDate}
          value={startDate}
          onChange={(date) => {
            setStartDate(date);
            setEndDate(null);
          }}
          style={{ marginBottom: 16, width: "100%" }}
          placeholder="Дата начала заморозки"
        />
        <DatePicker
          disabledDate={disabledEndDate}
          value={endDate}
          onChange={setEndDate}
          style={{ width: "100%" }}
          placeholder="Дата окончания заморозки"
          disabled={!startDate}
        />
      </Modal>


      <Modal
        title="QR-код абонемента"
        open={isModalVisible}
        onCancel={closeQrModal}
        style={{maxWidth: "500px", width: "100%"}}
        footer={null}
        // footer={[
        //   <Button
        //     key="enter"
        //     type="primary"
        //     onClick={() => handleVisit(selectedMembership.qrCode, 'вход')}
        //   >
        //     Войти
        //   </Button>,
        //   <Button
        //     key="exit"
        //     danger
        //     onClick={() => handleVisit(selectedMembership.qrCode, 'выход')}
        //   >
        //     Выйти
        //   </Button>,
        // ]}
      >
        {selectedMembership && (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",}}>
            <QRCode value={selectedMembership.qrCode} size={300} />
            <p style={{ marginTop: 16, color: "#000000"}}>{selectedMembership.qrCode}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}));

export default MyMemberships;
