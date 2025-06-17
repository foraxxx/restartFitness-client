import React, { useEffect, useState } from "react";
import {Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Switch, Select} from "antd"
import MembershipService from "../../services/MembershipService";
import statusService from "../../services/statusService.js"
import typeService from "../../services/typeService.js"

const AdminMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingMembership, setEditingMembership] = useState(null);
  const { TextArea } = Input;

  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await statusService.getAllForMemberships();
      const res2 = await typeService.getAllForMemberships();
      setStatuses(res1?.data);
      setTypes(res2?.data);
    };
    fetchData();
  }, []);

  console.log(statuses)
  console.log(types)


  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const response = await MembershipService.getAll(); // должен возвращать все (активные и неактивные)
      setMemberships(response.data);
    } catch (e) {
      message.error("Не удалось загрузить абонементы");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingMembership(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingMembership(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await MembershipService.delete(id);
      message.success("Абонемент удалён");
      fetchMemberships();
    } catch (e) {
      message.error("Ошибка при удалении");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingMembership) {
        // console.log(editingMembership.id, values)
        await MembershipService.update(editingMembership.id, values);
        message.success("Абонемент обновлён");
      } else {
        // console.log(values)
        await MembershipService.create(values);
        message.success("Абонемент добавлен");
      }
      setIsModalOpen(false);
      fetchMemberships();
    } catch (e) {
      message.error("Ошибка при сохранении");
    }
  };

  const columns = [
    { title: "Название", dataIndex: "name", key: "name" },
    { title: "Цена", dataIndex: "price", key: "price", render: (value) => `${value}₽` },
    { title: "Длительность (дней)", dataIndex: "durationDays", key: "durationDays" },
    {
      title: "Статус",
      dataIndex: ["Status", "name"],
      key: "status"
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">Редактировать</Button>
          <Popconfirm title="Удалить абонемент?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">Удалить</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h3 className="content-title">Список абонементов</h3>
        <Button type="primary" onClick={handleAddClick}>Добавить абонемент</Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={memberships}
        loading={loading}
        pagination={false}
      />

      <Modal
        open={isModalOpen}
        title={editingMembership ? "Редактировать абонемент" : "Добавить абонемент"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText="Сохранить"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={<span style={{ color: 'white' }}>Название</span>}
            rules={[{ required: true, message: "Введите название" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ color: 'white' }}>Описание</span>}
            rules={[{ required: true, message: "Введите описание" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label={<span style={{ color: 'white' }}>Стоимость</span>}
            rules={[{ required: true, message: "Введите цену" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="durationDays"
            label={<span style={{ color: 'white' }}>Длительность (в днях)</span>}
            rules={[{ required: true, message: "Введите длительность" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            name="isFreezing"
            label={<span style={{ color: 'white' }}>Можно ли замораживать?</span>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, current) => prev.isFreezing !== current.isFreezing}
          >
            {({ getFieldValue }) =>
              getFieldValue("isFreezing") && (
                <Form.Item
                  name="freezingDays"
                  label={<span style={{ color: 'white' }}>Количество дней заморозки</span>}
                  rules={[{ required: true, message: "Введите количество дней" }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item
            name="StatusId"
            label={<span style={{ color: 'white' }}>Статус</span>}
            rules={[{ required: true, message: "Выберите статус" }]}
          >
            <Select placeholder="Выберите статус">
              {statuses.map((status) => (
                <Select.Option key={status.id} value={status.id}>
                  {status.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="MembershipTypeId"
            label={<span style={{ color: 'white' }}>Тип</span>}
            rules={[{ required: true, message: "Выберите тип абонемента" }]}
          >
            <Select placeholder="Выберите тип">
              {types.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMemberships;
