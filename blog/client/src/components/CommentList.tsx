import "./CommentList.css";

interface Comment {
  id: string;
  content: string;
}

const CommentList = ({ comments }: { comments: Comment[] }) => {
  const renderedComments = comments.map((comment) => {
    return (
      <li className="comment-list__item" key={comment.id}>
        {comment.content}
      </li>
    );
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
