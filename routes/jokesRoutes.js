import express from 'express';
import {
  createJoke,
  deleteAllJokes,
  deleteJoke,
  filterJokes,
  getJokeById,
  getRandomJoke,
  patchJoke,
  replaceJoke,
} from "../controllers/jokesController.js";

// Create a dedicated router for joke-related routes.
const router = express.Router();

// GET a random joke
router.get("/random", getRandomJoke);

// GET a specific joke
router.get("/jokes/:id", getJokeById);

// GET a jokes by filtering on the joke type
router.get("/filter", filterJokes);

// POST a new joke
router.post("/jokes", createJoke);

// PUT a joke
router.put("/jokes/:id", replaceJoke);

// PATCH a joke
router.patch("/jokes/:id", patchJoke);

// DELETE Specific joke
router.delete("/jokes/:id", deleteJoke);

// DELETE All jokes
router.delete("/all", deleteAllJokes);

// Share this router with the main Express app.
export default router;