import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json())
app.use(cors({ origin: ['http://localhost:3000'] }));

app.post('/v1/query', async (req, res) => {
  const body = req.body;
  body.provider = "my_rhoai";
  body.model = "granite-8b";
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

app.listen(8080, () => {
  console.log('Express server listening on port 8080');
});
