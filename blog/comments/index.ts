import express from "express";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());

type Comment = { id: string; content: string; status: string };
const commentsByPostId: Record<string, Comment[]> = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .catch((err) => {
      console.error("Error broadcasting event:", err.message);
    });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received event:", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    if (comments) {
      const comment = comments.find((comment) => comment.id === id);
      if (comment) {
        comment.status = status;
      }
      await axios
        .post("http://localhost:4005/events", {
          type: "CommentUpdated",
          data: {
            postId,
            id,
            status,
            content,
          },
        })
        .catch((err) => {
          console.error("Error broadcasting event:", err.message);
        });
    }
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Server is running on port 4001");
});
