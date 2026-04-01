import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Chart imports
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  // ✅ LOGIN STATES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const fetchPolls = async () => {
    const res = await axios.get("http://localhost:5000/polls");
    setPolls(res.data);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const createPoll = async () => {
    await axios.post("http://localhost:5000/create", {
      question,
      options
    });
    setQuestion("");
    setOptions(["", ""]);
    fetchPolls();
  };

  const vote = async (pollId, index) => {
    await axios.post("http://localhost:5000/vote", {
      pollId,
      optionIndex: index
    });
    fetchPolls();
  };

  // ✅ REGISTER
  const register = async () => {
    await axios.post("http://localhost:5000/register", {
      username,
      password
    });
    alert("Registered successfully");
  };

  // ✅ LOGIN
  const login = async () => {
    const res = await axios.post("http://localhost:5000/login", {
      username,
      password
    });

    setToken(res.data.token);
    alert("Login successful");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#f5f5f5" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        🗳️ Poll Voting App
      </h1>

      {/* ✅ LOGIN UI */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      >
        <h2>Login</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <button onClick={register}>Register</button>
        <button onClick={login} style={{ marginLeft: "10px" }}>
          Login
        </button>

        {token && <p style={{ color: "green" }}>✅ Logged in</p>}
      </div>

      {/* Create Poll */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2>Create Poll</h2>

        <input
          value={question}
          placeholder="Enter Question"
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            width: "100%"
          }}
        />

        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[i] = e.target.value;
              setOptions(newOptions);
            }}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "10px",
              width: "100%"
            }}
          />
        ))}

        <button
          onClick={createPoll}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Create Poll
        </button>
      </div>

      {/* Poll List */}
      <h2>All Polls</h2>

      {polls.map((poll) => {
        const data = {
          labels: poll.options.map(opt => opt.text),
          datasets: [
            {
              label: "Votes",
              data: poll.options.map(opt => opt.votes),
              backgroundColor: ["green", "blue", "orange", "pink"]
            }
          ]
        };

        return (
          <div
            key={poll._id}
            style={{
              background: "white",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{poll.question}</h3>

            {poll.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => vote(poll._id, i)}
                style={{
                  margin: "8px",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  cursor: "pointer"
                }}
              >
                {opt.text} ({opt.votes})
              </button>
            ))}

            {/* Chart */}
            <div style={{ width: "300px", marginTop: "20px" }}>
              <Bar data={data} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;