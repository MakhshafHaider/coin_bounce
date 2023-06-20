import styles from './CommentList.module.css';
import React from 'react';
import Comment from '../../components/Comment/Comment';

export default function CommentList({ comments }) {
  return (
    <div className={styles.commentListWrapper}>
      {comments.length === 0 ? (
        <div className={styles.noComments}>
          No Comments Posted
        </div>
      ) : (
        // eslint-disable-next-line
        comments.map((comment) => {
          return (
            <Comment key={comment._id} comment={comment} />
          );
        })
      )}
    </div>
  );
}
