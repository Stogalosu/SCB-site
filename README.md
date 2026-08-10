# Smart Chess Board Website

## What is this?
A website I want to integrate with my smart chess board. For now, I've coded the chess interface and logic, as I'm still learning how to build websites. You can log in to see the dashboard (which does nothing) or play chess.

## Why?
I recently build a smart chess board that can move the pieces and I thought I should make a website that can control it. I also wanted to learn how to build a website.

## Hosting it locally
To host the website yourself, clone the repo. Then, create a file named ".env" in the project's root folder and paste these lines while replacing the values accordingly:
```
DATABASE_URL="[your_postgress_database_url]"
BETTER_AUTH_SECRET=[your_randomly_generated_secret]
BETTER_AUTH_URL=http://localhost:3000
```

After that, install pnpm and run the following command to install all dependencies:
```
pnpm install
```

To start the server, run:
```
pnpm dev
```

## Demo
You can test the website here:
http://stecker.ddns.net:3001

## AI Usage
I used AI for debugging and for writing a function that checks whether a chess piece is on the line between two other pieces.

## Screenshots

