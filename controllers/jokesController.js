let jokes = [
  {
    id: 1,
    jokeText:
      "Why don't scientists trust atoms? Because they make up everything.",
    jokeType: "Science",
  },
  {
    id: 2,
    jokeText:
      "Why did the scarecrow win an award? Because he was outstanding in his field.",
    jokeType: "Puns",
  },
  {
    id: 3,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 4,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 5,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 6,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 7,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 8,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 9,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 10,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 11,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 12,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 13,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 14,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 15,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
];

function normalizeType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function validateTextLength(text) {
  if (text.length < 3) {
    return "Joke text is too short.";
  }

  if (text.length > 500) {
    return "Joke is too long (max 500 chars).";
  }

  return null;
}

function findJokeById(id) {
  return jokes.find((joke) => joke.id === id);
}

function isDuplicateJokeText(text, excludeId = null) {
  return jokes.some(
    (joke) =>
      joke.jokeText.toLowerCase() === text.toLowerCase() &&
      joke.id !== excludeId,
  );
}

function getValidatedId(idParam, res) {
  const jokeId = parseInt(idParam);

  if (isNaN(jokeId)) {
    res.status(400).json({ error: "Invalid id. Please provide a number." });
    return null;
  }

  return jokeId;
}

function getValidatedJokeInput(req, res, excludeId = null) {
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

  if (isDuplicateJokeText(text, excludeId)) {
    res.status(409).json({ error: "This joke text already exists." });
    return null;
  }

  return {
    text,
    type: normalizeType(type),
  };
}

export function getRandomJoke(req, res) {
  if (jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available." });
  }

  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.json(jokes[randomIndex]);
}

export function getJokeById(req, res) {
  const jokeId = getValidatedId(req.params.id, res);
  if (jokeId === null) {
    return;
  }

  const specificJoke = findJokeById(jokeId);

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
  const jokeResult = jokes.filter(
    (joke) => joke.jokeType.toLowerCase() === formattedType.toLowerCase(),
  );

  if (jokeResult.length === 0) {
    return res
      .status(404)
      .json({ error: `No jokes found for type "${formattedType}".` });
  }

  res.json(jokeResult);
}

export function createJoke(req, res) {
  const cleanData = getValidatedJokeInput(req, res);
  if (!cleanData) {
    return;
  }

  const nextJokeId =
    jokes.length > 0 ? Math.max(...jokes.map((joke) => joke.id)) + 1 : 1;

  const newJoke = {
    id: nextJokeId,
    jokeText: cleanData.text,
    jokeType: cleanData.type,
  };

  jokes.push(newJoke);
  res.status(201).json(newJoke);
}

export function replaceJoke(req, res) {
  const jokeId = getValidatedId(req.params.id, res);
  if (jokeId === null) {
    return;
  }

  const cleanData = getValidatedJokeInput(req, res, jokeId);
  if (!cleanData) {
    return;
  }

  const foundJoke = findJokeById(jokeId);

  if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  foundJoke.jokeText = cleanData.text;
  foundJoke.jokeType = cleanData.type;

  res.json(foundJoke);
}

export function patchJoke(req, res) {
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
  const foundJoke = findJokeById(jokeId);

  if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  if (text !== null) {
    const textLengthError = validateTextLength(text);
    if (textLengthError) {
      return res.status(400).json({ error: textLengthError });
    }

    if (isDuplicateJokeText(text, jokeId)) {
      return res.status(409).json({ error: "This joke text already exists." });
    }

    foundJoke.jokeText = text;
  }

  if (type !== null) {
    if (type.length === 0) {
      return res.status(400).json({ error: "Type is required." });
    }

    foundJoke.jokeType = normalizeType(type);
  }

  res.json(foundJoke);
}

export function deleteJoke(req, res) {
  const jokeId = getValidatedId(req.params.id, res);
  if (jokeId === null) {
    return;
  }

  if (jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available to delete." });
  }

  const initialLength = jokes.length;
  jokes = jokes.filter((joke) => joke.id !== jokeId);

  if (jokes.length < initialLength) {
    return res
      .status(200)
      .json({ message: `Joke with id ${jokeId} deleted successfully.` });
  }

  res.status(404).json({ error: `Joke with id ${jokeId} not found.` });
}

export function deleteAllJokes(req, res) {
  const key = (req.query.key || "").trim();
  const masterKey = process.env.MASTER_KEY;

  if (jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available." });
  }

  if (key === masterKey) {
    jokes = [];
    return res.status(200).json({ message: "Full deletion successful." });
  }

  res.status(401).json({ error: "Invalid master key." });
}
