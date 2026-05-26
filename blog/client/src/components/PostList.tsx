import axios from "axios";
import { useEffect, useState } from "react";
import "./PostList.css";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4002/posts");
    console.log(res.data);
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post: any) => {
    return (
      <div className="post-card" key={post.id}>
        <h3 className="post-card__title">{post.title}</h3>
        <CommentList comments={post.comments} />
        <CreateComment postId={post.id} />
      </div>
    );
  });

  return <div className="post-list">{renderedPosts}</div>;
};

export default PostList;
