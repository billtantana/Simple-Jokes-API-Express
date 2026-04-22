import "dotenv/config";
import express from "express";
import {
  getAllJokes,
  getRandomJoke,
  getJokeById,
  filterJokes,
  createJoke,
  replaceJoke,
  patchJoke,
  deleteJoke,
  deleteAllJokes,
} from "../controllers/postgresController.js";

// Create a dedicated router for joke-related routes.
const router = express.Router();

// GET a random joke
router.get("/random", getAllJokes, getRandomJoke);

// GET a specific joke
router.get("/jokes/:id", getAllJokes, getJokeById);

// GET a jokes by filtering on the joke type
router.get("/filter", getAllJokes, filterJokes);

// POST a new joke
router.post("/jokes", getAllJokes, createJoke);

// PUT a joke
router.put("/jokes/:id", getAllJokes, replaceJoke);

// PATCH a joke
router.patch("/jokes/:id", getAllJokes, patchJoke);

// DELETE Specific joke
router.delete("/jokes/:id", deleteJoke);

// DELETE All jokes
router.delete("/all", deleteAllJokes);

// Share this router with the main Express app
export default router;
