# Knot — URL Shortener Backend

A simple URL shortener built with **Node.js**, **Express**, and **MongoDB**. Paste a long URL and get back a short, shareable link that redirects to the original.

## Features

- Generate short links from long URLs
- Redirect short links to their original destination
- Track visit history (timestamp on every redirect)
- MongoDB for persistent storage

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Short ID Generator:** shortid
- **CORS:** cors

## Project Structure

```
url-shortener/
├── config/
│   └── database.js         # MongoDB connection
├── models/
│   └── urlSchema.js          # Url schema
├── controllers/
│   └── urlControllers.js     # Shorten link logic
├── routes/
│   └── urlRoutes.js           # Shorten route
├── .env                        # Environment variables (not committed)
├── .gitignore
├── package.json
└── index.js                    # App entry point + redirect handler
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd url-shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=4000
DATABASE_URL=your_mongodb_connection_string
BASE_URL=http://localhost:4000
```

> `BASE_URL` is used to build the full short link returned in the response (e.g. `http://localhost:4000/AbC123`). Update this to your deployed URL in production.

### 4. Run the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:4000`.

## API Endpoints

### Create a short URL

**POST** `/url`

```json
{
  "url": "https://example.com/a/very/long/path?that=goes&on=forever"
}
```

**Response**

```json
{
  "success": true,
  "message": "Url generated successfully",
  "id": "AbC123",
  "shortUrl": "http://localhost:4000/AbC123"
}
```

### Visit / redirect a short URL

**GET** `/:shortId`

Redirects the browser to the original long URL and logs a visit timestamp.

```
http://localhost:4000/AbC123  →  redirects to the original long URL
```

If the short link doesn't exist, returns:

```
404 Short link not found
```

## Environment Variables Reference

| Variable        | Description                                   |
|------------------|-------------------------------------------------|
| `PORT`           | Port the server runs on                          |
| `DATABASE_URL`   | MongoDB connection string                        |
| `BASE_URL`       | Public base URL used to build short links        |

## Notes

- Short IDs are generated using the `shortid` package — call `shortid.generate()`, not `shortid()` (the package is not callable as a function).
- Make sure `cors` is installed and applied (`app.use(cors())`) before your routes if calling this API from a separate frontend origin.

## License

This project is open source and available for personal and educational use.
