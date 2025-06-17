import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../shared/Header/Header.jsx";
import UserService from "../../services/UserService.js";
import styles from "./UserPage.module.scss";
import UserMembershipCard from "../../shared/UserMembershipCard/UserMembershipCard.jsx"
import {Button, Collapse, message, Modal, Select} from "antd"
import MembershipService from "../../services/MembershipService.js"
import PaymentsService from "../../services/PaymentsService.js"

const { Panel } = Collapse;
const { Option } = Select;

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getOne(id);
        setUser(response.data);
      } catch (e) {
        setError("Не удалось загрузить данные пользователя");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await MembershipService.getAllActive();
        console.log(response.data)
        setMemberships(response.data);
      } catch (e) {
        message.error("Не удалось загрузить абонементы");
      }
    };

    fetchMemberships();
  }, []);

  if (!user) return <p>Нет данных</p>;

  const {Role:role, UserMemberships:userMemberships} = user;

  const statusPriority = {
    "Активный": 1,
    "Заморожен": 2,
    "Запланирован": 3,
    "Завершён": 4
  };

  const sortedMemberships = [...(userMemberships || [])].sort((a, b) => {
    const aPriority = statusPriority[a.Status?.name] || 99;
    const bPriority = statusPriority[b.Status?.name] || 99;
    return aPriority - bPriority;
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleConfirm = async () => {
    try {
      if (!selectedMembershipId) {
        message.warning("Пожалуйста, выберите абонемент");
        return;
      }

      // Находим выбранный абонемент по ID
      const selectedMembership = memberships.find(m => m.id === selectedMembershipId);
      if (!selectedMembership) {
        message.error("Абонемент не найден");
        return;
      }

      const paymentData = {
        amount: selectedMembership.price,
        membershipId: selectedMembership.id,
        paymentMethod: 'Банковская карта',
        type: 'Абонемент',
        userId: id,
        returnUrl: window.location.href
      };

      const data = await PaymentsService.createPayment(paymentData);
      console.log('data:', data);

      window.location.href = data.confirmation_url;
    } catch (error) {
      message.error(error.response?.data?.message || 'У вас уже есть запланированный абонемент');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Профиль пользователя</h2>

        {isLoading && <p>Загрузка...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {user && (
          <div className={styles.card}>
            <div className={styles.basicInfo}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt="Аватар пользователя"/>
                ) : (
                  <div className={styles.placeholder}>
                    {user.name?.[0]}
                    {user.surName?.[0]}
                  </div>
                )}
              </div>
              <div className={styles.infoText}>
                <p><strong>ФИО:</strong> {user.surName} {user.name}</p>
                <p><strong>Телефон:</strong> {user.number}</p>
                <p><strong>Email:</strong> {user.email || "—"}</p>
                <p><strong>Роль:</strong> {role?.name}</p>
                <p><strong>Создан:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <Button type="primary" onClick={handleOpenModal} className={styles.addMembershipBtn}>
                Оформить абонемент
              </Button>
            </div>

            <Collapse
              bordered={false}
              defaultActiveKey={[]}
              className={styles.accordion}
              expandIcon={() => null}
            >
              <Panel
                header={<div className={styles.panelHeader} style={{color: "black"}}>Абонементы пользователя</div>}
                key="1"
                className={styles.panel}
              >
                <div className={styles.memberships}>
                  {sortedMemberships?.length > 0 ? (
                    sortedMemberships.map(m => (
                      <UserMembershipCard
                        key={m.id}
                        membership={m}
                        className={styles.membershipCard}
                      />
                    ))
                  ) : (
                    <p className={styles.noMemberships}>Нет абонементов</p>
                  )}
                </div>
              </Panel>
            </Collapse>

          </div>
        )}
      </div>
      <Modal
        title="Оформить абонемент"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText="Оформить"
        cancelText="Отмена"
      >
        <p>Выберите абонемент:</p>
        <Select
          style={{ width: "100%" }}
          placeholder="Выберите абонемент"
          onChange={value => setSelectedMembershipId(value)}
          value={selectedMembershipId}
        >
          {memberships.map(m => (
            <Option key={m.id} value={m.id}>
              {m.name + ` (${m.MembershipType.name})`}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default UserPage;
