import express from "express";
import cors from "cors";
import axios from "axios";
import argsParser from "args-parser"
import { fetchEventSource } from "@ai-zen/node-fetch-event-source";

import * as fs from "fs";

const app = express();
app.use(express.json())
app.use(cors({ origin: ['http://localhost:3000'] }));

const args = argsParser(process.argv);
console.log(args);

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
    let r;
    if (args.test) {
      const response = fs.readFileSync("./sample.md", "utf-8");
      const data = {
        conversation_id: "123e4567-e89b-12d3-a456-426614174000",
        referenced_documents: [
          {
            "docs_url": "https://reference.html",
            "title": "Referenced Doc"
          }
        ],
        response,
        truncated: false
      }
      r = {
        status: 200,
        data,
      }
      console.log(JSON.stringify(r));
    } else {
      r = await axios.post(
        "http://127.0.0.1:8081/v1/query/",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );  
    }
    return res.status(r.status).send(JSON.stringify(r.data));
  } catch (e) {
    console.log(e);
  }
});

app.post('/v1/streaming_query', async (req, res) => {
  const body = req.body;
  if (!body.provider) {
    body.provider = "my_rhoai_g3";
  }
  if (!body.model) {
    body.model = "granite3-8b";
  }
  console.log(JSON.stringify(body));

  try {
    await fetchEventSource(
      "http://127.0.0.1:8081/v1/streaming_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        async onopen(res) {
          if (res.ok && res.status === 200) {
              console.log("Opened");
              return; // everything's good
          } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
              // client-side errors are usually non-retriable:
              throw new FatalError();
          } else {
              throw new RetriableError();
          }``
        },
        onmessage(msg) {
          console.log(msg.data);
          res.write(`data: ${msg.data}\n\n`);
        },
        onclose() {
          res.end();
        }
      },
    );
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
