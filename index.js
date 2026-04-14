import express from "express";
import {
  createJoke,
  deleteAllJokes,
  deleteJoke,
  filterJokes,
  getJokeById,
  getRandomJoke,
  patchJoke,
  replaceJoke,
} from "./controllers/jokesController.js";

// Simple Jokes API built with Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data and JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/random", getRandomJoke);
app.get("/jokes/:id", getJokeById);
app.get("/filter", filterJokes);
app.post("/jokes", createJoke);
app.put("/jokes/:id", replaceJoke);
app.patch("/jokes/:id", patchJoke);
app.delete("/jokes/:id", deleteJoke);
app.delete("/all", deleteAllJokes);

// Start the Express server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
