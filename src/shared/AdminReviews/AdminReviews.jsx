import React, { useEffect, useState } from "react";
import { Table, Select, Button, Popconfirm, message, Tag } from "antd";
import ReviewService from "../../services/reviewService.js"; // Убедись, что сервис реализован

const { Option } = Select;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await ReviewService.getAll();
      setReviews(response.data);
    } catch (e) {
      message.error("Не удалось загрузить отзывы");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await ReviewService.delete(id);
      message.success("Отзыв удалён");
      fetchReviews();
    } catch (e) {
      message.error("Ошибка при удалении отзыва");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ReviewService.updateStatus(id, newStatus); // Метод должен быть реализован в ReviewService
      message.success("Статус обновлён");
      fetchReviews();
    } catch (e) {
      message.error("Ошибка при обновлении статуса");
    }
  };

  const filteredReviews =
    filteredStatus === "all"
      ? reviews
      : reviews.filter((r) => r.Status?.name === filteredStatus);

  const columns = [
    {
      title: "Пользователь",
      key: "user",
      render: (_, record) => {
        const user = record.User;
        return user ? `${user.name} ${user.surName}` : "Аноним";
      },
    },
    {
      title: "Текст отзыва",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Рейтинг",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Статус",
      key: "status",
      render: (_, record) => (
        <Tag color={record.Status?.name === "Опубликован" ? "green" : "orange"}>
          {record.Status?.name}
        </Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <>
          <Select
            defaultValue={record.Status?.name}
            style={{ width: 140, marginRight: 8 }}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Option value="На проверке">На проверке</Option>
            <Option value="Опубликован">Опубликован</Option>
          </Select>
          <Popconfirm
            title="Удалить отзыв?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link">Удалить</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h3 className="content-title">Отзывы</h3>

      <div style={{ marginBottom: 16 }}>
        <Select
          value={filteredStatus}
          onChange={setFilteredStatus}
          style={{ width: 200 }}
        >
          <Option value="all">Все отзывы</Option>
          <Option value="На проверке">На проверке</Option>
          <Option value="Опубликован">Опубликован</Option>
        </Select>
      </div>

      <Table
        rowKey="id"
        dataSource={filteredReviews}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminReviews;
