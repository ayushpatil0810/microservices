import express from "express";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());

type Post = { id: string; title: string };
const posts: Record<string, Post> = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body as { title: string };

  posts[id] = { id, title };

  await axios
    .post("http://localhost:4005/events", {
      type: "PostCreated",
      data: { id, title },
    })
    .catch((err) => {
      console.error("Error broadcasting event:", err.message);
    });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received event:", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("v2");
  console.log("Server is running on port 4000");
});
