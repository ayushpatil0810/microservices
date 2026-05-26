import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const event = req.body;

  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.error("Error broadcasting event to service 1:", err.message);
  });

  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.error("Error broadcasting event to service 2:", err.message);
  });

  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.error("Error broadcasting event to service 3:", err.message);
  });

  res.status(200).send({ status: "Event broadcasted" });
});

app.listen(4005, () => {
  console.log("Event bus listening on port 4005");
});
