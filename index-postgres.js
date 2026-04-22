import "dotenv/config";
import express from "express";
import jokeRoutes from "./routes/postgresRoutes.js";
import { end } from "./db/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", jokeRoutes);

// Start the Express server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await end(); // Wait for connections to close
  process.exit(0); // Exit with "Success" code
});
