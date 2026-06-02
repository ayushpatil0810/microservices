import "./CommentList.css";

interface Comment {
  id: string;
  content: string;
  status: "approved" | "pending" | "rejected";
}

const CommentList = ({ comments }: { comments: Comment[] }) => {
  const renderedComments = comments.map((comment) => {
    let content;

    // refactor to use switch statement

    switch (comment.status) {
      case "approved":
        content = comment.content;
        break;
      case "pending":
        content = "This comment is awaiting moderation";
        break;
      case "rejected":
        content = "This comment has been rejected";
        break;
      default:
        content = "Unknown status";
    }

    return (
      <li className="comment-list__item" key={comment.id}>
        {content}
      </li>
    );
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
