import React, { useState, useEffect, useContext } from 'react';
import Header from "../../shared/Header/Header.jsx";
import { observer } from "mobx-react-lite";
import './News.scss';
import { URL_TO_API } from "../../utils/consts.js";
import { Context } from "../../main.jsx";
import {Form, Image, Input, Modal, DatePicker, Select, Upload, message} from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Footer from "../../shared/Footer/Footer.jsx"

const statusTabs = [
  { key: "published", label: "Опубликованные" },
  { key: "postponed", label: "Отложенные" },
  { key: "archived", label: "Архивированные" }
];

const News = () => {
  const [activeTab, setActiveTab] = useState("published");
  const { userStore, newsStore } = useContext(Context);
  const [searchText, setSearchText] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [hoveredNewsId, setHoveredNewsId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Новое состояние для модалки добавления
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const statusValueEdit = Form.useWatch('status', form);
  const statusValueAdd = Form.useWatch('status', addForm);

  const { Option } = Select;
  const { Dragger } = Upload;

  useEffect(() => {
    const handleStatusChange = (formInstance, status) => {
      if (status === 'postponed') {
        formInstance.setFields([
          {
            name: 'publicationDate',
            rules: [{ required: true, message: 'Выберите дату и время!' }],
          },
        ]);
      } else {
        formInstance.setFields([
          {
            name: 'publicationDate',
            value: undefined,
            rules: [],
          },
        ]);
      }
    };

    handleStatusChange(form, statusValueEdit);
    handleStatusChange(addForm, statusValueAdd);
  }, [statusValueEdit, statusValueAdd]);

  useEffect(() => {
    newsStore.fetchNewsByStatus(activeTab).then(() => {
      setFilteredNews(newsStore.news);
    });

    return () => {
      newsStore.currentStatus = "published";
    };
  }, [activeTab, newsStore]);

  const newsStatuses = [
    { id: 1, name: 'Опубликовано' },
    { id: 2, name: 'Архивировано' },
    { id: 3, name: 'Отложено' }
  ];

  const showEditModal = (newsItem) => {
    form.resetFields();
    setEditingNews(newsItem);
    form.setFieldsValue({
      title: newsItem.title,
      text: newsItem.text,
      status: newsItem.NewsStatusId, // это id — Select покажет имя по этому id
      publicationDate: newsItem.publicationDate ? dayjs(newsItem.publicationDate) : null,
    });
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingNews(null);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('text', values.text);
      formData.append('NewsStatusId', values.status);
      formData.append('UserId', userStore.user.id);
      formData.append('publicationDate', values.publicationDate.toISOString() || Date.now());

      if (values.files?.length > 0) {
        values.files.forEach(file => {
          formData.append('documents', file.originFileObj);
        });
      }

      await newsStore.updateNews(editingNews.id, formData);
      message.success('Новость обновлена');
      setIsModalVisible(false);
      setEditingNews(null);

      newsStore.fetchNewsByStatus(activeTab).then(() => {
        setFilteredNews(newsStore.news);
      });
    } catch (error) {
      console.error("Ошибка при обновлении новости:" + (error.message || error));
      message.error('Ошибка при обновлении новости');
    }
  };

  // Открыть модалку добавления
  const showAddModal = () => {
    addForm.resetFields();
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      const formData = new FormData();

      formData.append('text', values.text);

      const statusMap = {
        published: 1,
        archived: 2,
        postponed: 3
      };

      formData.append('NewsStatusId', statusMap[values.status]);
      formData.append('UserId', userStore.user.id);
      formData.append('publicationDate', values.publicationDate ? dayjs(values.publicationDate).toISOString() : dayjs().toISOString());


      if (values.files?.length > 0) {
        values.files.forEach(file => {
          formData.append('documents', file.originFileObj);
        });
      }

      await newsStore.createNews(formData);
      message.success('Новость добавлена');
      setIsAddModalVisible(false);

      newsStore.fetchNewsByStatus(activeTab).then(() => {
        setFilteredNews(newsStore.news);
      });
    } catch (error) {
      console.error("Ошибка при добавлении новости:" + error.message || error);
      message.error('Ошибка при добавлении новости');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (!value) {
      setFilteredNews(newsStore.news);
      return;
    }

    const filtered = (newsStore.news || []).filter((item) => {
      const text = item.text?.toLowerCase() || '';
      return text.includes(value);
    });

    setFilteredNews(filtered);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Удаление новости',
      content: 'Вы уверены, что хотите удалить эту новость?',
      okText: 'Да',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await newsStore.deleteNews(id);
          newsStore.fetchNewsByStatus(activeTab).then(() => {
            setFilteredNews(newsStore.news);
          });
        } catch (error) {
          console.error("Ошибка при удалении новости:", error);
        }
      }
    });
  };

  const beforeUploadHandler = (file, fileList, formInstance) => {
    // Проверяем тип файла — разрешаем только изображения и видео mp4
    const isImage = file.type?.startsWith('image/');
    const isVideo = file.type === 'video/mp4';

    if (!isImage && !isVideo) {
      message.destroy();
      message.error('Можно загружать только изображения и видео (MP4).');
      return Upload.LIST_IGNORE;
    }

    const existingFiles = formInstance.getFieldValue('files') || [];
    const newFiles = [...existingFiles, ...fileList];

    const imageFiles = newFiles.filter(f => f.type?.startsWith('image/'));
    const videoFiles = newFiles.filter(f => f.type === 'video/mp4');

    // Запрещаем загружать и фото, и видео одновременно
    if (imageFiles.length > 0 && videoFiles.length > 0) {
      message.destroy();
      message.error('Нельзя загружать одновременно фото и видео');
      return Upload.LIST_IGNORE;
    }

    // Только одно видео
    if (videoFiles.length > 1) {
      message.destroy();
      message.error('Можно загрузить только одно видео');
      return Upload.LIST_IGNORE;
    }

    // Не больше 3 фото
    if (imageFiles.length > 3) {
      message.destroy();
      message.error('Можно загрузить не более 3 фото');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  return (
    <>
      <Header />
      <div className="admin-panel">
        {userStore.user.role === 'Администратор' && (
          <div className="sidebar">
            <h2 className="sidebar-title">Админ-панель</h2>
            <ul className="menu">
              {statusTabs.map(tab => (
                <li
                  key={tab.key}
                  className={`menu-item ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="content-wrapper">
          <div className="content-filters">
            <input
              className="filter-input"
              type="text"
              placeholder="Поиск по тексту новости"
              value={searchText}
              onChange={handleSearch}
            />
            {userStore.user.role === 'Администратор' ?
              <button className="add-news-button" onClick={showAddModal}>Добавить новость</button>
              : null
            }

          </div>

          <div className="content">
            <div className="news-list">
              {newsStore.isLoading ? (
                <p>Загрузка новостей...</p>
              ) : newsStore.error ? (
                <p className="error">{newsStore.error}</p>
              ) : filteredNews.length === 0 ? (
                <p>Новостей нет</p>
              ) : (
                filteredNews.map((news) => (
                  <div
                    key={news.id}
                    className="news-card"
                    onMouseEnter={() => setHoveredNewsId(news.id)}
                    onMouseLeave={() => setHoveredNewsId(null)}
                    style={{ position: 'relative' }}
                  >
                    <div className="news-media">
                      {news.NewsDocuments.map(doc => {
                        const fileUrl = `${URL_TO_API}/newsDocuments/${doc.url}`;
                        if (doc.type === "mp4") {
                          return (
                            <video key={doc.id} controls className="news-video">
                              <source src={fileUrl} type="video/mp4" />
                              Ваш браузер не поддерживает видео.
                            </video>
                          );
                        } else if (["jpg", "jpeg", "png", "gif"].includes(doc.type.toLowerCase())) {
                          return (
                            <div key={doc.id} className="image-wrapper">
                              <Image
                                src={fileUrl}
                                alt="Фото новости"
                                preview={true}
                                className="image"
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <p className="news-text" style={{ whiteSpace: 'pre-wrap' }} >{news.text}</p>

                    {news.User && (
                      <div className="news-footer">
                        <div>
                          {news.publicationDate && (
                            <p className="news-date">
                              Дата публикации: {new Date(news.publicationDate).toLocaleDateString()}
                            </p>
                          )}
                          <p className="news-author">
                            Автор: {news.User.name} {news.User.surName}
                          </p>
                        </div>
                        {userStore.user.role === 'Администратор' && hoveredNewsId === news.id && (
                          <div>
                            <button
                              className="edit-news-button"
                              onClick={() => showEditModal(news)}
                              style={{
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                zIndex: 10,
                                marginRight: '8px',
                              }}
                            >
                              Редактировать
                            </button>
                            <button
                              className="delete-news-button"
                              onClick={() => handleDelete(news.id)}
                              style={{
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                zIndex: 10,
                              }}
                            >
                              Удалить
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Модальное окно редактирования */}
        <Modal
          title="Редактирование новости"
          open={isModalVisible}
          onOk={handleUpdate}
          onCancel={handleCancel}
          okText="Сохранить"
          cancelText="Отмена"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              text: editingNews?.text,
              status: editingNews?.status,
              publicationDate: editingNews?.publicationDate
                ? dayjs(editingNews.publicationDate)
                : null,
            }}
          >
            <Form.Item
              label={<span style={{ color: 'white' }}>Текст новости</span>}
              name="text"
              rules={[{ required: true, message: 'Пожалуйста, введите текст новости!' }]}
            >
              <Input.TextArea
                rows={6}
                onPaste={e => {
                  e.preventDefault();
                  const clipboardData = e.clipboardData || window.clipboardData;
                  let text = clipboardData.getData('text/html') || clipboardData.getData('text/plain');

                  if (text) {
                    // Если вставляется HTML — заменим <div>, <br>, <p> на \n
                    text = text
                      .replace(/<div>/gi, '\n')
                      .replace(/<\/div>/gi, '')
                      .replace(/<br\s*\/?>/gi, '\n')
                      .replace(/<p>/gi, '\n')
                      .replace(/<\/p>/gi, '')
                      .replace(/&nbsp;/gi, ' ')
                      .replace(/&amp;/gi, '&');

                    // Очистим от остальных html тегов
                    text = text.replace(/<\/?[^>]+(>|$)/g, "");

                    // Вставляем текст с переносами в текущее место курсора
                    const input = e.target;
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    const value = input.value;
                    input.value = value.substring(0, start) + text + value.substring(end);

                    // Для управления состоянием — вызови onChange, если нужно
                    const event = new Event('input', { bubbles: true });
                    input.dispatchEvent(event);
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: 'white' }}>Статус</span>}
              name="status"
              rules={[{ required: true, message: 'Пожалуйста, выберите статус!' }]}
            >
              <Select placeholder="Выберите статус">
                {newsStatuses.map(status => (
                  <Select.Option key={status.id} value={status.id}>
                    {status.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span style={{ color: 'white' }}>Дата и время публикации</span>}
              name="publicationDate"
              rules={
                statusValueEdit === 'postponed'
                  ? [{ required: true, message: 'Выберите дату и время!' }]
                  : []
              }
            >
              <DatePicker
                showTime
                placeholder="Выберите дату и время публикации"
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                disabled={statusValueEdit !== 'postponed'}
                disabledDate={current => {
                  return current && current.isBefore(dayjs().startOf('day'));
                }}
                disabledTime={current => {
                  if (!current) return {};

                  const now = dayjs();

                  if (current.isSame(now, 'day')) {
                    const disabledHours = [];
                    for (let i = 0; i < now.hour(); i++) {
                      disabledHours.push(i);
                    }

                    const disabledMinutes = (selectedHour) => {
                      if (selectedHour === now.hour()) {
                        return Array.from({ length: now.minute() }, (_, i) => i);
                      }
                      return [];
                    };

                    return {
                      disabledHours: () => disabledHours,
                      disabledMinutes
                    };
                  }

                  return {};
                }}
              />
            </Form.Item>

            <Form.Item label={<span style={{ color: 'white' }}>Прикрепленные файлы (уже загруженные)</span>}>
              <div style={{ maxHeight: '150px', overflowY: 'auto', padding: '8px', border: '1px solid #d9d9d9', borderRadius: 4 }}>
                {editingNews?.NewsDocuments?.map(doc => {
                  const fileUrl = `${URL_TO_API}/newsDocuments/${doc.url}`;
                  return (
                    <div key={doc.id} style={{ marginBottom: 8 }}>
                      {doc.type === 'mp4' ? (
                        <video src={fileUrl} width="100%" controls />
                      ) : (
                        <Image src={fileUrl} width={100} />
                      )}
                    </div>
                  );
                })}
              </div>
            </Form.Item>

            <Form.Item
              label={<span style={{ color: 'white' }}>Загрузить новые файлы</span>}
              name="files"
              valuePropName="fileList"
              getValueFromEvent={e => e?.fileList}
            >
              <Dragger
                beforeUpload={(file, fileList) => beforeUploadHandler(file, fileList, addForm)}
                accept="image/*,video/mp4"
                multiple
                maxCount={3}
                style={{ padding: '20px 0' }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">Нажмите или перетащите файлы сюда для загрузки</p>
                <p className="ant-upload-hint">Поддерживается множественный выбор файлов</p>
              </Dragger>
            </Form.Item>
          </Form>
        </Modal>

        {/* Модальное окно добавления */}
        <Modal
          title="Добавить новость"
          open={isAddModalVisible}
          onOk={handleAddOk}
          onCancel={handleAddCancel}
          okText="Добавить"
          cancelText="Отмена"
        >
          <Form
            form={addForm}
            layout="vertical"
          >
            <Form.Item
              label={<span style={{ color: 'white' }}>Текст новости</span>}
              name="text"
              rules={[{ required: true, message: 'Пожалуйста, введите текст новости!' }]}
            >
              <Input.TextArea
                rows={6}/>
            </Form.Item>

            <Form.Item
              label={<span style={{ color: 'white' }}>Статус</span>}
              name="status"
              rules={[{ required: true, message: 'Пожалуйста, выберите статус!' }]}
            >
              <Select placeholder="Выберите статус">
                <Option value="published">Опубликовано</Option>
                <Option value="archived">Архивировано</Option>
                <Option value="postponed">Отложено</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<span style={{ color: 'white' }}>Дата и время публикации</span>}
              name="publicationDate"
              rules={
                statusValueAdd === 'postponed'
                  ? [{ required: true, message: 'Выберите дату и время!' }]
                  : []
              }

            >
              <DatePicker
                showTime
                placeholder="Выберите дату и время публикации"
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                disabled={statusValueAdd !== 'postponed'}
                disabledDate={current => {
                  return current && current.isBefore(dayjs().startOf('day'));
                }}
                disabledTime={current => {
                  if (!current) return {};

                  const now = dayjs();

                  if (current.isSame(now, 'day')) {
                    const disabledHours = [];
                    for (let i = 0; i < now.hour(); i++) {
                      disabledHours.push(i);
                    }

                    const disabledMinutes = (selectedHour) => {
                      if (selectedHour === now.hour()) {
                        return Array.from({ length: now.minute() }, (_, i) => i);
                      }
                      return [];
                    };

                    return {
                      disabledHours: () => disabledHours,
                      disabledMinutes
                    };
                  }

                  return {};
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: 'white' }}>Прикрепить файлы</span>}
              name="files"
              valuePropName="fileList"
              getValueFromEvent={e => e?.fileList}
            >
              <Dragger
                beforeUpload={(file, fileList) => beforeUploadHandler(file, fileList, addForm)}
                accept="image/*,video/mp4"
                multiple
                maxCount={3}
                style={{ padding: '20px 0' }}
              >
                <p className="ant-upload-drag-icon" style={{ fontSize: '32px', color: '#FFFFFF' }}>
                  <InboxOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">Нажмите или перетащите файлы сюда для загрузки</p>
                <p className="ant-upload-hint">Поддерживается множественный выбор файлов</p>
              </Dragger>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Footer/>
    </>
  );
};

export default observer(News);
