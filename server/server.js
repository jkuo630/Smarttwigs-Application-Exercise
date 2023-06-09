const express = require("express");
const cors = require("cors");
const app = express();

// Leaderboard array to store player data
let leaderboard = [];

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());

// GET route to fetch the leaderboard
app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// POST route to update the leaderboard
app.post("/leaderboard", (req, res) => {
  const { winner, score } = req.body;

  //Checks if winner is an existing player
  const existingPlayer = leaderboard.find((entry) => entry.player === winner);

  if (existingPlayer) {
    //If it is, update its wins and score
    existingPlayer.wins++;
    existingPlayer.points += score;
  } else {
    //If its not, then create a new leaderboard name!
    leaderboard.push({
      player: winner,
      wins: 1,
      points: score,
    });
  }

  // Sort the leaderboard based on wins and cumulative points
  leaderboard.sort((a, b) => {
    if (a.wins === b.wins) {
      return a.points - b.points;
    } else {
      return b.wins - a.wins;
    }
  });

  res.sendStatus(200);
});

// Start the server
app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
