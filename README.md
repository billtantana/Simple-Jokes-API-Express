# Simple Jokes API (Express)

A small REST API built with Express for serving and managing a collection of jokes.

This repo now includes two app modes:

- `index-contained.js`: an in-memory version for learning and quick testing
- `index-postgres.js`: a PostgreSQL-backed version with persistent data

## Features

- Get a random joke
- Get a joke by ID
- Filter jokes by type
- Add a new joke
- Replace an existing joke
- Partially update a joke
- Delete one joke
- Delete all jokes with a master key

## Tech Stack

- Node.js
- Express
- PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- PostgreSQL

### Installation

```bash
npm install
```

### Environment Setup

Create a local `.env` file from `.env.example`, then update the values as needed.

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` and set:

- `DATABASE` to your PostgreSQL database name
- `DB_USER` to your PostgreSQL username
- `DB_PASSWORD` to your PostgreSQL password
- `MASTER_KEY` to your preferred secret key
- `PORT` to the port you want the API to run on

Example:

```env
DATABASE="jokes_db"
DB_USER="postgres"
DB_PASSWORD="your_password"
MASTER_KEY="your-secret-key"
PORT=3000
```

## Database Setup

The database-backed app expects a `jokes` table with this structure:

```sql
CREATE TABLE jokes (
  id INTEGER PRIMARY KEY,
  joke_text TEXT NOT NULL,
  joke_type VARCHAR(100) NOT NULL
);
```

Initial joke data lives in [data/jokes.csv](/c:/Projects/Simple-Jokes-API-Express/data/jokes.csv).

Import it into PostgreSQL after creating the table:

```sql
COPY jokes(id, joke_text, joke_type)
FROM 'C:/Projects/Simple-Jokes-API-Express/data/jokes.csv'
DELIMITER ','
CSV HEADER;
```

If PostgreSQL cannot read files from that path directly, use `\copy` from `psql` instead:

```bash
\copy jokes(id, joke_text, joke_type) FROM 'C:/Projects/Simple-Jokes-API-Express/data/jokes.csv' WITH (FORMAT csv, HEADER true)
```

## Running The Apps

### PostgreSQL-backed app

Runs the API wired to PostgreSQL:

```bash
npm run dev
```

Entry file:

```text
index-postgres.js
```

### In-memory app

Runs the self-contained version that stores jokes in memory only:

```bash
npm run dev-contained
```

Entry file:

```text
index-contained.js
```

The API runs on:

```text
http://localhost:3000
```

## Testing The API

To try the endpoints manually, you will want an API client or HTTP client.

Common options include:

- Postman
- Insomnia
- Bruno
- Hoppscotch

You can also test with `curl` from the command line, and example requests are included below in the API section.

## App Differences

- The in-memory app resets to its original joke list every time the server restarts.
- The PostgreSQL app persists changes in the database.
- Both apps expose the same REST endpoints.

## Data Model

### In-memory responses

```json
{
  "id": 1,
  "jokeText": "Why don't scientists trust atoms? Because they make up everything.",
  "jokeType": "Science"
}
```

### PostgreSQL responses

```json
{
  "id": 1,
  "joke_text": "Why don't scientists trust atoms? Because they make up everything.",
  "joke_type": "Science"
}
```

## API Endpoints

### `GET /random`

Returns one random joke.

```bash
curl http://localhost:3000/random
```

### `GET /jokes/:id`

Returns a specific joke by ID.

```bash
curl http://localhost:3000/jokes/1
```

### `GET /filter?type=Science`

Returns jokes that match the provided `type`.

```bash
curl "http://localhost:3000/filter?type=Science"
```

### `POST /jokes`

Creates a new joke.

Request body:

```json
{
  "text": "Why was the JavaScript developer sad? Because they didn't Node how to Express themselves.",
  "type": "Programming"
}
```

```bash
curl -X POST http://localhost:3000/jokes \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Why was the JavaScript developer sad? Because they didn't Node how to Express themselves.\",\"type\":\"Programming\"}"
```

### `PUT /jokes/:id`

Replaces an existing joke.

```json
{
  "text": "Updated joke text",
  "type": "Updated type"
}
```

```bash
curl -X PUT http://localhost:3000/jokes/1 \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Updated joke text\",\"type\":\"Updated type\"}"
```

### `PATCH /jokes/:id`

Updates one or more fields on an existing joke.

```json
{
  "text": "Only the text changed"
}
```

```bash
curl -X PATCH http://localhost:3000/jokes/1 \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Only the text changed\"}"
```

### `DELETE /jokes/:id`

Deletes a specific joke by ID.

```bash
curl -X DELETE http://localhost:3000/jokes/1
```

### `DELETE /all?key=YOUR_MASTER_KEY`

Deletes all jokes if the correct master key is supplied.

```bash
curl -X DELETE "http://localhost:3000/all?key=your-secret-key"
```

## Scripts

```bash
npm run dev
```

Starts the PostgreSQL-backed app.

```bash
npm run dev-contained
```

Starts the in-memory app.

## Project Structure

```text
.
|-- controllers/
|-- data/
|-- db/
|-- routes/
|-- utils/
|-- index-contained.js
|-- index-postgres.js
|-- package.json
`-- README.md
```
