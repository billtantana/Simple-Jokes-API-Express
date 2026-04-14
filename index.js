import express from "express";

// Simple Jokes API built with Express
const app = express();
const port = process.env.PORT || 3000;
const masterKey = process.env.MASTER_KEY;

// Starter joke data stored in memory
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

// Middleware to parse form data and JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validation check
function validateJoke(req, res, next) {
  const id = parseInt(req.params.id);
  const rawText = req.body.text;
  const rawType = req.body.type;

  // Ensure type and text is a string
  if (typeof rawText !== "string" || typeof rawType !== "string") {
    return res.status(400).json({ error: "Text and type must be strings." });
  }

  const text = rawText.trim();
  const type = rawType.trim();

  // Ensure they aren't empty after trimming
  if (!type || !text) {
    return res.status(400).json({ error: "Text and type are required." });
  }

  // Length check (e.g., min 4 characters)
  if (text.length < 3) {
    return res.status(400).json({ error: "Joke text is too short." });
  }

  // Length check (e.g., max 500 characters)
  if (text.length > 500) {
    return res.status(400).json({ error: "Joke is too long (max 500 chars)." });
  }

  // Duplicate joke check
  const isDuplicate = jokes.some(
    (joke) =>
      joke.jokeText.toLowerCase() === text.toLowerCase() && joke.id !== id,
  );

  if (isDuplicate) {
    return res.status(409).json({ error: "This joke text already exists." });
  }

  // Attach cleaned data to the request object so routes can use it directly
  req.cleanData = {
    text,
    type: type.charAt(0).toUpperCase() + type.slice(1),
  };

  next(); // Move to the actual route handler
}

// GET a random joke
app.get("/random", (req, res) => {
  // If no jokes are available.
  if (jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available." });
  }

  // Generate a random index based on the current jokes array length
  const randomIndex = Math.floor(Math.random() * jokes.length);

  res.json(jokes[randomIndex]);
});

// GET a specific joke
app.get("/jokes/:id", (req, res) => {
  // Convert the route parameter to a number so it can match the stored joke IDs
  const jokeId = parseInt(req.params.id);

  // Ensure ID exist and a number
  if (isNaN(jokeId)) {
    return res
      .status(400)
      .json({ error: "Invalid id. Please provide a number." });
  }

  // Find the joke by ID
  const specificJoke = jokes.find((joke) => joke.id === jokeId);

  // Send error if no joke found
  if (!specificJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  res.json(specificJoke);
});

// GET jokes by filtering on the joke type
app.get("/filter", (req, res) => {
  // Read the requested joke category from the query string
  const type = (req.query.type || "").trim();

  // Ensure type exist
  if (!type) {
    return res.status(400).json({ error: "Type is required." });
  }

  // Format the input to match the "Capitalized" storage format
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  // Filter out all the jokes by type
  const jokeResult = jokes.filter(
    (joke) => joke.jokeType.toLowerCase() === formattedType.toLowerCase(),
  );

  // Check if the array is empty
  if (jokeResult.length === 0) {
    return res
      .status(404)
      .json({ error: `No jokes found for type "${formattedType}".` });
  }

  res.json(jokeResult);
});

// POST a new joke
app.post("/jokes", validateJoke, (req, res) => {
  // Create the next ID by finding the current highest one and adding 1
  const nextJokeId =
    jokes.length > 0 ? Math.max(...jokes.map((joke) => joke.id)) + 1 : 1;

  // Build the new joke object from the request body
  const newJoke = {
    id: nextJokeId,
    jokeText: req.cleanData.text,
    jokeType: req.cleanData.type,
  };

  jokes.push(newJoke);
  res.status(201).json(newJoke);
});

// PUT a joke
app.put("/jokes/:id", validateJoke, (req, res) => {
  // Convert the route parameter to a number so it can match the stored joke IDs
  const jokeId = parseInt(req.params.id);

  // Ensure ID exist, is a number
  if (isNaN(jokeId)) {
    return res
      .status(400)
      .json({ error: "Invalid id. Please provide a number." });
  }

  // Find the joke by ID
  const foundJoke = jokes.find((joke) => joke.id === jokeId);

  // Return error message if no joke was found
  if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  // Replace old joke with new joke
  foundJoke.jokeText = req.cleanData.text;
  foundJoke.jokeType = req.cleanData.type;

  res.json(foundJoke);
});

// PATCH a joke
app.patch("/jokes/:id", (req, res) => {
  // Convert the route parameter to a number so it can match the stored joke IDs
  const jokeId = parseInt(req.params.id);

  // Ensure both text and type is available
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

  // ensure ID exist, is a number
  if (isNaN(jokeId)) {
    return res
      .status(400)
      .json({ error: "Invalid id. Please provide a number." });
  }

  // Find the joke by ID
  const foundJoke = jokes.find((joke) => joke.id === jokeId);

  // Return error message if no joke was found
  if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found." });
  }

  // Only patch what is needed
  if (text !== null) {
    // Length check (e.g., min 4 characters)
    if (text.length < 3) {
      return res.status(400).json({ error: "Joke text is too short." });
    }

    // Length check (e.g., max 500 characters)
    if (text.length > 500) {
      return res
        .status(400)
        .json({ error: "Joke is too long (max 500 chars)." });
    }

    // Duplicate joke check
    const isDuplicate = jokes.some(
      (joke) =>
        joke.jokeText.toLowerCase() === text.toLowerCase() &&
        joke.id !== jokeId,
    );

    if (isDuplicate) {
      return res.status(409).json({ error: "This joke text already exists." });
    }

    foundJoke.jokeText = text;
  }

  if (type !== null) {
    if (type.length === 0) {
      return res.status(400).json({ error: "Type is required." });
    }

    // Format the input to match the "Capitalized" storage format
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    foundJoke.jokeType = formattedType;
  }

  res.json(foundJoke);
});

// DELETE a specific joke
app.delete("/jokes/:id", (req, res) => {
  const jokeId = parseInt(req.params.id);

  // If no jokes are available.
  if (jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available to delete." });
  }

  // ensure ID exist and a number
  if (isNaN(jokeId)) {
    return res
      .status(400)
      .json({ error: "Invalid id. Please provide a number." });
  }

  // Check if the joke exists before filtering
  const initialLength = jokes.length;

  // Immutably remove the joke
  jokes = jokes.filter((joke) => joke.id !== jokeId);

  // Compare lengths to see if anything was actually removed
  if (jokes.length < initialLength) {
    res
      .status(200)
      .json({ message: `Joke with id ${jokeId} deleted successfully.` });
  } else {
    res.status(404).json({ error: `Joke with id ${jokeId} not found.` });
  }
});

// DELETE all jokes
app.delete("/all", (req, res) => {
  // Use the query key as a simple safeguard before removing everything
  const key = (req.query.key || "").trim();

  // If no jokes are available.
  if (jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available." });
  }

  // Validate keys
  if (key === masterKey) {
    jokes = [];
    res.status(200).json({ message: "Full deletion successful." });
  } else {
    res.status(401).json({ error: "Invalid master key." });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
