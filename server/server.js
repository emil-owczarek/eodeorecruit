const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

//get all jobs
app.get("/jobs/:userEmail", async (req, res) => {
  const userEmail = req.params.userEmail;

  try {
    const jobs = await pool.query(
      "SELECT * FROM jobs WHERE user_email = $1 ORDER BY " +
        "CASE status " +
        "WHEN 'CV Sent' THEN 1 " +
        "WHEN 'Test Task Assigned' THEN 2 " +
        "WHEN 'HR Interview' THEN 3 " +
        "WHEN 'Technical Interview' THEN 4 " +
        "WHEN 'Application Rejected' THEN 5 " +
        "WHEN 'Application Closed' THEN 6 " +
        "WHEN 'Offer Received' THEN 7 " +
        "ELSE 8 END, date",
      [userEmail]
    );
    res.json(jobs.rows);
  } catch (err) {
    console.error(err);
  }
});

// create a new job post
app.post("/jobs", async (req, res) => {
  const { user_email, title, status, date, selectedIcon, link } = req.body;
  const id = uuidv4();

  try {
    const newJob = await pool.query(
      "INSERT INTO jobs (id, user_email, title, status, date, icon_src, icon_id, link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        id,
        user_email,
        title,
        status,
        date,
        selectedIcon.src,
        selectedIcon.id,
        link,
      ]
    );
    res.json(newJob);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Bad Request" });
  }
});

/// edit a job post
app.put("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, status, date, selectedIcon, link } = req.body;

  try {
    const editJob = await pool.query(
      "UPDATE jobs SET user_email = $1, title = $2, status = $3, date = $4, icon_src = $5, icon_id = $6, link = $7 WHERE id = $8",
      [
        user_email,
        title,
        status,
        date,
        selectedIcon.src,
        selectedIcon.id,
        link,
        id,
      ]
    );
    res.json(editJob);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Bad Request" });
  }
});

// delete a job post
app.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteJob = await pool.query("DELETE FROM jobs WHERE id = $1;", [id]);
    res.json(deleteJob);
  } catch (err) {
    console.error(err);
  }
});

// edit note
app.put("/jobs/:id/notes", async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    const updateNotes = await pool.query(
      "UPDATE jobs SET note = $1 WHERE id = $2",
      [notes, id]
    );
    res.json(updateNotes);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Bad Request" });
  }
});

// signup endpoint
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signUp = await pool.query(
      "INSERT INTO users (email, hashed_password) VALUES ($1, $2)",
      [email, hashedPassword]
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await pool.query("SELECT * FROM users WHERE email =$1", [
      email,
    ]);

    if (!users.rows.length) return res.json({ detail: "User does not exist" });

    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    if (success) {
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({
        detail:
          "The username or password you entered is incorrect. Please try again.",
      });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
