import express from "express";
import cors from "cors";
import { pool } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});
app.get("/db-health", async (_, res) => {const result = await pool.query("SELECT now()");
  res.json({ db: "connected", time: result.rows[0] });
});

export default app;
