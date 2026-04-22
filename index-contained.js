import "dotenv/config";
import express from "express";
import jokeRoutes from "./routes/jokesRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data and JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", jokeRoutes);

// Start the Express server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
