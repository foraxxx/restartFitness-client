import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {Form, Input, Button, Rate, List, message, Modal, Checkbox, ConfigProvider} from "antd"
import Header from "../../shared/Header/Header.jsx";
import styles from "./Reviews.module.scss";
import { Context } from "../../main.jsx";

const { TextArea } = Input;

const ReviewsPage = observer(() => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const { userStore, reviewsStore } = useContext(Context);

  useEffect(() => {
    reviewsStore.fetchReviews();
  }, [reviewsStore]);

  // При открытии модального окна сбрасываем форму
  const openModal = () => {
    form.resetFields();
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const onFinish = async (values) => {
    try {
      console.log(values.rating);
      await reviewsStore.createReview(values);
      message.success("Отзыв успешно отправлен на проверку!");
      closeModal();
    } catch {
      message.error("Ошибка при отправке отзыва");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <p className={styles.title}>
          Отзывы
        </p>

        {userStore.isAuth && (
          <div className={styles.buttonWrapper}>
            <Button type="primary" onClick={openModal}>
              Оставить отзыв
            </Button>
          </div>
        )}

        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={reviewsStore.published}
          renderItem={(review) => (
            <List.Item>
              <div className={styles.reviewCard}>
                <div className={styles.reviewAuthor}>
                  {review.isAnonymous
                    ? "Анонимный пользователь"
                    : `${review.User.surName} ${review.User.name}`}
                </div>

                <div className={styles.reviewText}>
                  {review.description}
                </div>

                <div className={styles.reviewFooter}>
                  <div className={styles.reviewRating}>
                    <Rate disabled allowHalf defaultValue={review.rating} className={styles.whiteRate}/>
                  </div>

                  <div className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

              </div>
            </List.Item>
          )}
        />


        <Modal
          title="Оставить отзыв"
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          // destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{isAnonymous: false}}
            className={styles.whiteLabel}
          >
            <Form.Item
              label={<span style={{color: 'white'}}>Текст отзыва</span>}
              name="description"
              rules={[{required: true, message: "Пожалуйста, введите текст отзыва"}]}
            >
              <TextArea rows={4}/>
            </Form.Item>

            <Form.Item
              label={<span style={{color: 'white'}}>Рейтинг</span>}
              name="rating"
              rules={[{required: true, message: "Пожалуйста, введите текст отзыва" }]}
              >
                  <Rate
                    allowHalf
                    allowClear={false}
                    className={styles.whiteRate}
                    starBg="White"
                  />
            </Form.Item>

            <Form.Item name="isAnonymous" valuePropName="checked">
              <Checkbox style={{ color: "white" }}>Анонимный отзыв</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={reviewsStore.isLoading} block>
                Отправить отзыв
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
});

export default ReviewsPage;
