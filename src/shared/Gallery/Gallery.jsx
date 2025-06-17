import React, { useState } from "react";
import { Row, Col, Image } from "antd";
import "./Gallery.scss";

const images = [
  "/gymPhotos/zal0.jpg",
  "/gymPhotos/zal1.jpg",
  "/gymPhotos/zal2.jpg",
  "/gymPhotos/zal3.jpg",
  "/gymPhotos/zal4.jpg",
  "/gymPhotos/zal5.jpg",
  "/gymPhotos/zal6.jpg",
  "/gymPhotos/zal7.jpg",
];

const Gallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const showModal = (src) => {
    setSelectedImage(src);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="gallery">
      <h2 className="gallery__title">Наш зал</h2>
      <Row gutter={[16, 16]}>
        {images.map((src, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={8} xl={6}>
            <div className="gallery__image-wrapper">
              <Image
                src={src}
                alt={`Зал ${index + 1}`}
                preview={true}
                className="gallery__image"
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Gallery;
