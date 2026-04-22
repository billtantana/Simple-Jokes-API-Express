export function getValidatedId(idParam, res) {
  const jokeId = parseInt(idParam);

  if (isNaN(jokeId)) {
    res.status(400).json({ error: "Invalid id. Please provide a number." });
    return null;
  }

  return jokeId;
}

export function findJokeById(id, jokes) {
  return jokes.find((joke) => joke.id === id);
}

export function normalizeType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function validateTextLength(text) {
  if (text.length < 3) {
    return "Joke text is too short.";
  }

  if (text.length > 500) {
    return "Joke is too long (max 500 chars).";
  }

  return null;
}

export function isDuplicateJokeText(text, excludeId = null, jokes) {
  return jokes.some(
    (joke) =>
      joke.joke_text.toLowerCase() === text.toLowerCase() &&
      joke.id !== excludeId,
  );
}

export function getValidatedJokeInput(req, res, excludeId = null) {
  const rawText = req.body.text;
  const rawType = req.body.type;

  if (typeof rawText !== "string" || typeof rawType !== "string") {
    res.status(400).json({ error: "Text and type must be strings." });
    return null;
  }

  const text = rawText.trim();
  const type = rawType.trim();

  if (!type || !text) {
    res.status(400).json({ error: "Text and type are required." });
    return null;
  }

  const textLengthError = validateTextLength(text);
  if (textLengthError) {
    res.status(400).json({ error: textLengthError });
    return null;
  }

  if (isDuplicateJokeText(text, excludeId, res.locals.jokes)) {
    res.status(409).json({ error: "This joke text already exists." });
    return null;
  }

  return {
    text,
    type: normalizeType(type),
  };
}
