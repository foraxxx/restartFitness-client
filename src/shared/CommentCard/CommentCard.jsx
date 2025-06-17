import React from "react";
import { Rate } from "antd";
import "./CommentCard.scss";

const CommentCard = ({ review }) => {
  const { description, rating, isAnonymous, user } = review;
  const author = isAnonymous ? "Анонимно" : `${user.firstName} ${user.lastName}`;

  return (
    <div className="comment-card">
      <p className="comment-text">"{description}"</p>
      <div className="comment-footer">
        <span className="comment-author">{author}</span>
        <Rate disabled allowHalf value={Number(rating)} className="comment-rating" />
      </div>
    </div>
  );
};

export default CommentCard;
