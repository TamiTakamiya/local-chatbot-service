import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json())
app.use(cors({ origin: ['http://localhost:3000'] }));

app.post('/v1/query', async (req, res) => {
  const body = req.body;
  if (!body.provider) {
    body.provider = "my_rhoai_g3";
  }
  if (!body.model) {
    body.model = "granite3-8b";
  }
  console.log(JSON.stringify(body));
  try {
    const r = await axios.post(
      "http://127.0.0.1:8081/v1/query/",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return res.status(r.status).send(JSON.stringify(r.data));
  } catch (e) {
    console.log(e);
  }
});

app.post('/v1/feedback', async (req, res) => {
  const body = req.body;
  console.log(JSON.stringify(body));
  try {
    return res.status(200).send(JSON.stringify("{}"));
  } catch (e) {
    console.error(e);
  }
});

app.listen(8080, () => {
  console.log('Express server listening on port 8080');
});
