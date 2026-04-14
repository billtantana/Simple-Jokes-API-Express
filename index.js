import express from "express";
import bodyParser from "body-parser";

// Simple Jokes API built with Express
const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

// Middleware to parse form data and JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// GET a random joke
app.get("/random", (req, res) => {
  // Generate a random index based on the current jokes array length
  const randomIndex = Math.floor(Math.random() * jokes.length);

  res.json(jokes[randomIndex]);
});

// GET a specific joke
app.get("/jokes/:id", (req, res) => {
  // Convert the route parameter to a number so it can match the stored joke IDs
  const jokeId = Number(req.params.id);
  const specificJoke = jokes.find((joke) => joke.id === jokeId);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "Invalid ID format. Please provide a number." });
  } else if (!specificJoke) {
    return res.status(404).json({ error: "Joke not found" });
  }

  res.json(specificJoke);
});

// GET jokes by filtering on the joke type
app.get("/filter", (req, res) => {
  // Read the requested joke category from the query string
  const type = req.query.type;
  const jokeResult = jokes.filter((joke) => joke.jokeType === type);

  if (!jokeResult) {
    return res.status(404).json({ error: "Joke not found" });
  }

  res.json(jokeResult);
});

// POST a new joke
app.post("/jokes", (req, res) => {
  const text = req.body.text;
  const type = req.body.type;

  // Create the next ID by finding the current highest one and adding 1
  const nextJokeId =
    jokes.length > 0 ? Math.max(...jokes.map((joke) => joke.id)) + 1 : 1;

  // Build the new joke object from the request body
  const newJoke = {
    id: nextJokeId,
    jokeText: text,
    jokeType: type,
  };

  jokes.push(newJoke);
  res.json(newJoke);
});

// PUT a joke
app.put("/jokes/:id", (req, res) => {
  // Convert the ID from the URL and locate the matching joke
  const id = Number(req.params.id);
  const foundJoke = jokes.find((joke) => joke.id === id);
  const text = req.body.text;
  const type = req.body.type;

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "Invalid ID format. Please provide a number." });
  } else if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found" });
  }

  foundJoke.jokeText = text;
  foundJoke.jokeType = type;

  // Return the fully updated joke
  res.json(foundJoke);
});

// PATCH a joke
app.patch("/jokes/:id", (req, res) => {
  // Find the joke first, then only update the fields that were provided
  const id = Number(req.params.id);
  const foundJoke = jokes.find((joke) => joke.id === id);
  const text = req.body.text;
  const type = req.body.type;

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "Invalid ID format. Please provide a number." });
  } else if (!foundJoke) {
    return res.status(404).json({ error: "Joke not found" });
  }

  if (text) foundJoke.jokeText = text;
  if (type) foundJoke.jokeType = type;

  res.json(foundJoke);
});

// DELETE a specific joke
app.delete("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Edge case: handle non-numeric input
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "Invalid ID format. Please provide a number." });
  }

  // Check if the joke exists before filtering
  const initialLength = jokes.length;

  // Immutably remove the joke
  jokes = jokes.filter((joke) => joke.id !== id);

  // Compare lengths to see if anything was actually removed
  if (jokes.length < initialLength) {
    res
      .status(200)
      .json({ message: `Joke with id: ${id} deleted successfully.` });
  } else {
    res.status(404).json({ error: `Joke with id: ${id} not found.` });
  }
});

// DELETE all jokes
app.delete("/all", (req, res) => {
  // Use the query key as a simple safeguard before removing everything
  const key = req.query.key;

  if (key === masterKey) {
    jokes = [];
    res.status(200).json({ message: "Full deleteion successful." });
  } else {
    res.status(404).json({ error: `Key ${keyPrompt} is invailid.` });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

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
