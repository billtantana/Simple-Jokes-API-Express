import { Query } from "pg";
import { query } from "../db/index.js";
import {
  getValidatedId,
  findJokeById,
  normalizeType,
  getValidatedJokeInput,
  validateTextLength,
  isDuplicateJokeText,
} from "../utils/postgresUtil.js";

export async function getAllJokes(req, res, next) {
  try {
    const jokes = await query("SELECT * FROM jokes");

    res.locals.jokes = jokes.rows;
    next();
  } catch (error) {
    console.log("Error fetching jokes:", error);
    next(error);
  }
}

export function getRandomJoke(req, res) {
  if (res.locals.jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available." });
  }

  const randomIndex = Math.floor(Math.random() * res.locals.jokes.length);
  res.json(res.locals.jokes[randomIndex]);
}

export function getJokeById(req, res) {
  const jokeId = getValidatedId(req.params.id, res);
  if (jokeId === null) {
    return;
  }

  const specificJoke = findJokeById(jokeId, res.locals.jokes);

  if (!specificJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  res.json(specificJoke);
}

export function filterJokes(req, res) {
  const type = (req.query.type || "").trim();

  if (!type) {
    return res.status(400).json({ error: "Type is required." });
  }

  const formattedType = normalizeType(type);
  const jokeResult = res.locals.jokes.filter(
    (joke) => joke.joke_type.toLowerCase() === formattedType.toLowerCase(),
  );

  if (jokeResult.length === 0) {
    return res
      .status(404)
      .json({ error: `No jokes found for type "${formattedType}".` });
  }

  res.json(jokeResult);
}

export async function createJoke(req, res) {
  const cleanData = getValidatedJokeInput(req, res);
  if (!cleanData) {
    return;
  }

  await query("INSERT INTO jokes (joke_text, joke_type) VALUES ($1, $2)", [
    cleanData.text,
    cleanData.type,
  ]);

  const newJoke = await query("SELECT * FROM jokes WHERE joke_text = $1", [
    cleanData.text,
  ]);

  res.status(201).json(newJoke.rows[0]);
}

export async function replaceJoke(req, res) {
  const jokeId = getValidatedId(req.params.id, res);
  if (jokeId === null) {
    return;
  }

  const cleanData = getValidatedJokeInput(req, res, jokeId);
  if (!cleanData) {
    return;
  }

  const foundJoke = findJokeById(jokeId, res.locals.jokes);

  if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  await query("UPDATE jokes SET joke_text = $1, joke_type = $2 WHERE id = $3", [
    cleanData.text,
    cleanData.type,
    jokeId,
  ]);

  const updatedJoke = await query("SELECT * FROM jokes WHERE id = $1", [
    jokeId,
  ]);

  res.json(updatedJoke.rows[0]);
}

export async function patchJoke(req, res) {
  const jokeId = getValidatedId(req.params.id, res);
  if (jokeId === null) {
    return;
  }

  if (!("text" in req.body) && !("type" in req.body)) {
    return res.status(400).json({ error: "Provide text or type to update." });
  }

  if (
    ("text" in req.body && typeof req.body.text !== "string") ||
    ("type" in req.body && typeof req.body.type !== "string")
  ) {
    return res.status(400).json({ error: "Text and type must be strings." });
  }

  const text = "text" in req.body ? req.body.text.trim() : null;
  const type = "type" in req.body ? req.body.type.trim() : null;
  const foundJoke = findJokeById(jokeId, res.locals.jokes);

  if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  if (text !== null) {
    const textLengthError = validateTextLength(text);
    if (textLengthError) {
      return res.status(400).json({ error: textLengthError });
    }

    if (isDuplicateJokeText(text, jokeId, res.locals.jokes)) {
      return res.status(409).json({ error: "This joke text already exists." });
    }

    await query("UPDATE jokes SET joke_text = $1 WHERE id = $2", [
      text,
      jokeId,
    ]);
  }

  if (type !== null) {
    if (type.length === 0) {
      return res.status(400).json({ error: "Type is required." });
    }

    await query("UPDATE jokes SET joke_type = $1 WHERE id = $2", [
      normalizeType(type),
      jokeId,
    ]);
  }

  const patchedJoke = await query("SELECT * FROM jokes WHERE id = $1", [
    jokeId,
  ]);

  res.json(patchedJoke.rows[0]);
}

export async function deleteJoke(req, res) {
  const jokeId = getValidatedId(req.params.id, res);
  if (jokeId === null) {
    return;
  }

  const selectJokeById = await query("SELECT * FROM jokes WHERE id = $1", [jokeId]);

  if (!selectJokeById.rows[0]) {
    return res.status(404).json({ error: "That joke is not available to delete." });
  }

  await query("DELETE FROM jokes WHERE id = $1", [jokeId]);

  const deletedRecord = await query("SELECT * FROM jokes WHERE id = $1", [jokeId]);

  if (!deletedRecord.rows[0]) {
    return res
      .status(200)
      .json({ message: `Joke with id ${jokeId} deleted successfully.` });
  }

  res.status(404).json({ error: `Joke with id ${jokeId} not found.` });
}

export async function deleteAllJokes(req, res) {
  const key = (req.query.key || "").trim();
  const masterKey = process.env.MASTER_KEY;

  const jokeCount = await query("SELECT COUNT(*) FROM jokes");

  console.log(jokeCount.rows[0].count);

  if (Number(jokeCount.rows[0].count) === 0) {
    return res.status(404).json({ error: "Out of laughs, No jokes available to delete." });
  }

  if (key === masterKey) {
    await query("DELETE FROM jokes");

    return res.status(200).json({ message: "Full deletion successful." });
  }

  res.status(401).json({ error: "Invalid master key." });
}
