# Simple Jokes API (Express)

A small REST API built with Express for serving and managing a collection of jokes.

This project keeps its data in memory, so any changes you make are reset when the server restarts.

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

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Run the Server

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Data Model

Each joke uses the following shape:

```json
{
  "id": 1,
  "jokeText": "Why don't scientists trust atoms? Because they make up everything.",
  "jokeType": "Science"
}
```

## API Endpoints

### `GET /random`

Returns one random joke.

Example:

```bash
curl http://localhost:3000/random
```

### `GET /jokes/:id`

Returns a specific joke by ID.

Example:

```bash
curl http://localhost:3000/jokes/1
```

### `GET /filter?type=Science`

Returns jokes that match the provided `type`.

Example:

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

Example:

```bash
curl -X POST http://localhost:3000/jokes \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Why was the JavaScript developer sad? Because they didn't Node how to Express themselves.\",\"type\":\"Programming\"}"
```

### `PUT /jokes/:id`

Replaces an existing joke.

Request body:

```json
{
  "text": "Updated joke text",
  "type": "Updated type"
}
```

Example:

```bash
curl -X PUT http://localhost:3000/jokes/1 \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Updated joke text\",\"type\":\"Updated type\"}"
```

### `PATCH /jokes/:id`

Updates one or more fields on an existing joke.

Request body example:

```json
{
  "text": "Only the text changed"
}
```

Example:

```bash
curl -X PATCH http://localhost:3000/jokes/1 \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Only the text changed\"}"
```

### `DELETE /jokes/:id`

Deletes a specific joke by ID.

Example:

```bash
curl -X DELETE http://localhost:3000/jokes/1
```

### `DELETE /all?key=YOUR_MASTER_KEY`

Deletes all jokes if the correct master key is supplied.

Current key in `index.js`:

```text
4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT
```

Example:

```bash
curl -X DELETE "http://localhost:3000/all?key=4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT"
```

## Notes

- Data is stored in a local array inside `index.js`.
- This is a learning/demo project, not a production-ready API.
- Since the data is not persisted, restarting the app restores the original 15 jokes.

## Scripts

```bash
npm start
```

## Project Structure

```text
.
|-- index.js
|-- package.json
|-- package-lock.json
`-- README.md
```
