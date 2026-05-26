import "./CreatePost.css";
import axios from "axios";
import { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/posts", {
        title,
      });

      console.log("Post created:", response.data);

      setTitle("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-post">
      <form className="create-post__form" onSubmit={handleSubmit}>
        <div className="create-post__top">
          <h2 className="create-post__heading">Create a Post</h2>
          <p className="create-post__text">
            Write something simple and meaningful.
          </p>
        </div>

        <div className="create-post__field">
          <label className="create-post__label" htmlFor="title">
            Title
          </label>

          <input
            className="create-post__input"
            type="text"
            id="title"
            name="title"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <button className="create-post__button" type="submit">
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
