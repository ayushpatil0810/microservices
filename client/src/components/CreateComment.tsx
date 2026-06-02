import { useState } from "react";
import axios from "axios";
import "./CreateComment.css";

const CreateComment = ({ postId }: { postId: string }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };

  return (
    <div className="create-comment">
      <form className="create-comment__form" onSubmit={handleSubmit}>
        <div className="create-comment__field">
          <label className="create-comment__label" htmlFor="">
            New Comment
          </label>
          <input
            className="create-comment__input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
          />
        </div>
        <button className="create-comment__button">Submit</button>
      </form>
    </div>
  );
};

export default CreateComment;
