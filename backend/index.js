const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJjMzQ3YmRkOTY5NTQyMjEyNTkyOGIxOGFjN2RkYmVhZGE2NTI2Njk5NTVhZjk2NWEzMzUwMWQ1YzViYWZjNzI5ZTYyOTQwZDViYmYxYjIyIn0.eyJhdWQiOiIyOWQ1MGNhYS1mZmNiLTQ2MDktOWU2Zi0yYTJhMjAxYzZjNWMiLCJqdGkiOiIyYzM0N2JkZDk2OTU0MjIxMjU5MjhiMThhYzdkZGJlYWRhNjUyNjY5OTU1YWY5NjVhMzM1MDFkNWM1YmFmYzcyOWU2Mjk0MGQ1YmJmMWIyMiIsImlhdCI6MTcxODkyMDcxNywibmJmIjoxNzE4OTIwNzE3LCJleHAiOjE3NDU5NzEyMDAsInN1YiI6IjExMTc5MTEwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxODA5MTIyLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZDAwNjg1MjAtYzkyZi00ODA2LTkxN2EtMjcxOTk0ZDZkYmNkIn0.OzYPI1oHjVfC0ndGGlqw3NwLFmExT6OqDHiRs4gb8jNSdBbdhOA_1BoUHUDKLgG1KJ4JIT_WQU2t1JZ6Zi9pKfR8RPKsGB9l_ihjgR6Ef1p_Cd0zx5SYGUXbehab8OmNt-7-tXkWSlwcGJXoCKOWxFp64mGUiUmpwgiEAYB3BPo_43KCwJY-mAucxC5PuAKsYkrRvT5p33dgq2OgJTwecLSu4eGnGJ6KSs8gflCEcruy7G6FJ-97liGuBoSvlUVBLl4Gs1OMppP173YFqlflR2J3ird7L9ulWee1akGVuETK367uCZy6Uouq1jyjiBG4FTlJF2W2dbSmwCsCJq4DtA";

app.get("/leads", async function (request, response) {
  const query = request.query.query ? `?query=${request.query.query}` : "";

  const users = await axios.get("https://artcurkin.amocrm.ru/api/v4/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const pipelines = await axios.get(
    "https://artcurkin.amocrm.ru/api/v4/leads/pipelines/8299342",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const leads = await axios.get(
    "https://artcurkin.amocrm.ru/api/v4/leads" + query,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(!leads.data);
  if (!leads.data) {
    return response.status(204).json();
  }

  const newLeads = [];

  for (let i = 0; i < leads?.data._embedded.leads.length; i++) {
    const leadStatus = pipelines.data._embedded.statuses.find((element) => {
      return element.id == leads.data._embedded.leads[i].status_id;
    });

    const leadUser = users.data._embedded.users.find((element) => {
      return element.id == leads.data._embedded.leads[i].responsible_user_id;
    });

    newLeads.push({
      ...leads.data._embedded.leads[i],
      color: leadStatus.color,
      statusName: leadStatus.name,
      user: leadUser.name,
    });
  }

  response.json(newLeads);
});

app.listen(3000);
