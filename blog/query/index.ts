import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const posts: {
  [key: string]: {
    id: string;
    title: string;
    comments: { id: string; content: string; status: string }[];
  };
} = {};

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post?.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post?.comments.find((c) => c.id === id);
    if (comment) {
      comment.content = content;
      comment.status = status;
    }
  }

  console.log(posts);
  res.sendStatus(200);
});

app.listen(4002, () => {
  console.log("Server is running on port 4002");
});
