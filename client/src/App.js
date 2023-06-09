import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [score, setScore] = useState([0, 0]);
  const [server, setServer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [startingServer, setStartingServer] = useState(1);

  useEffect(() => {
    // Fetch leaderboard data when component mounts
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:4000/leaderboard");
      if (response.ok) {
        const leaderboardData = await response.json();
        setLeaderboardData(leaderboardData);
      } else {
        throw new Error("Failed to fetch leaderboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleScoreUpdate = async (player) => {
    if (winner) {
      return; // Ignore score updates if there's already a winner
    }

    const newScore = [...score];
    newScore[player - 1]++;

    if (newScore[player - 1] > 10 && Math.abs(newScore[0] - newScore[1]) >= 2) {
      // We have a winner
      const winnerName = player === 1 ? player1 : player2;
      setWinner(winnerName);
      await updateLeaderboard(winnerName, newScore[player - 1]);
    } else {
      setScore(newScore);
      if ((newScore[0] + newScore[1]) % 2 === 0) {
        // Switch server every 2 points
        setServer(server === 1 ? 2 : 1);
      }
    }
  };

  const updateLeaderboard = async (winner, score) => {
    try {
      const response = await fetch("http://localhost:4000/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winner, score }),
      });

      if (response.ok) {
        const leaderboardData = await response.json();
        setLeaderboardData(leaderboardData);
      } else {
        throw new Error("Failed to update leaderboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaderboardDisplay = async () => {
    try {
      const response = await fetch("http://localhost:4000/leaderboard");
      if (response.ok) {
        const leaderboardData = await response.json();
        setLeaderboardData(leaderboardData);
      } else {
        throw new Error("Failed to fetch leaderboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlayAgain = () => {
    setPlayer1("");
    setPlayer2("");
    setScore([0, 0]);
    setServer(startingServer);
    setWinner(null);
  };

  const sortLeaderboard = (a, b) => {
    if (a.wins === b.wins) {
      return a.points - b.points; // Sort by points in ascending order
    } else {
      return b.wins - a.wins; // Sort by wins in descending order
    }
  };

  const handleEndGame = async () => {
    setPlayer1("");
    setPlayer2("");
    setScore([0, 0]);
    setServer(startingServer);
    setWinner(null);
    await updateLeaderboard(null, 0);
  };

  return (
    <div>
      <h2>Ping Pong Point Manager</h2>
      {!winner && (
        <div>
          <input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            placeholder="Player 1"
          />
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Player 2"
          />
          <div>
            <label>Starting Server:</label>
            <select
              value={startingServer}
              onChange={(e) => setStartingServer(Number(e.target.value))}
            >
              <option value={1}>{player1}</option>
              <option value={2}>{player2}</option>
            </select>
          </div>
          <div>
            <h3>Score</h3>
            <p>
              {player1}: {score[0]}
            </p>
            <p>
              {player2}: {score[1]}
            </p>
            <button onClick={() => handleScoreUpdate(1)}>
              {player1} Scores
            </button>
            <button onClick={() => handleScoreUpdate(2)}>
              {player2} Scores
            </button>
            <button onClick={handleEndGame}>End Game</button>
          </div>
        </div>
      )}
      {winner && (
        <div>
          <h3>Winner: Player {winner}</h3>
          <button onClick={handleLeaderboardDisplay}>
            Display Leaderboard
          </button>
          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      )}
      {leaderboardData.length > 0 && (
        <div>
          <h3>Leaderboard</h3>
          <ul>
            {leaderboardData.sort(sortLeaderboard).map((entry, index) => (
              <li key={index}>
                Player: {entry.player}, Wins: {entry.wins}, Points:{" "}
                {entry.points}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
