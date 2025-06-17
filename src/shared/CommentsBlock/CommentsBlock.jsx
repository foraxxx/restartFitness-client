import React from "react";
import CommentCard from "../CommentCard/CommentCard.jsx";
import "./CommentsBlock.scss";

const CommentsBlock = ({ reviews }) => {
  return (
    <section className="comments__block">
      <p className="comments__title">Отзывы наших клиентов</p>
      {reviews.map((review) => (
        <CommentCard key={review.id} review={review} />
      ))}
    </section>
  );
};

export default CommentsBlock;
