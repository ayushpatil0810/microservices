import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const events: any[] = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);

  axios
    .post("http://posts-clusterip-service:4000/events", event)
    .catch((err) => {
      console.error("Error broadcasting event to service 1:", err.message);
    });

  axios.post("http://comments-service:4001/events", event).catch((err) => {
    console.error("Error broadcasting event to service 2:", err.message);
  });

  axios.post("http://query-service:4002/events", event).catch((err) => {
    console.error("Error broadcasting event to service 3:", err.message);
  });

  axios.post("http://moderation-service:4003/events", event).catch((err) => {
    console.error("Error broadcasting event to service 4:", err.message);
  });

  res.status(200).send({ status: "Event broadcasted" });
});

app.get("/events", (req, res) => {
  res.status(200).send(events);
});

app.listen(4005, () => {
  console.log("Event bus listening on port 4005");
});
