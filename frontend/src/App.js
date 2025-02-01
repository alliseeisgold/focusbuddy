import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AppBar, Tabs, Tab, Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import CurrentTab from "./components/CurrentTab";
import PlanTab from "./components/PlanTab";
import PomodoroTab from "./components/PomodoroTab";
import HabitsTab from "./components/HabitsTab";
import Login from "./components/Login";
import Signup from "./components/Signup";
import rainSound from "./assets/rain-sound.mp3";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));

  // 🔥 Следим за изменением `localStorage`
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // ✅ Функция выхода (удаляет токен и обновляет состояние)
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <MainPage
                  selectedTab={selectedTab}
                  handleChange={handleChange}
                  handleLogout={handleLogout} // ✅ Передаем logout-функцию
                />
              ) : (
                <Navigate to="/sign-in" />
              )
            }
          />
          <Route path="/sign-in" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/sign-up" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const MainPage = ({ selectedTab, handleChange, handleLogout }) => {
  const [workTime, setWorkTime] = useState(25);
  const [restTime, setRestTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsWorkTime(!isWorkTime);
      setTimeLeft(isWorkTime ? restTime * 60 : workTime * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWorkTime, workTime, restTime]);

  const toggleMusic = () => {
    const audio = document.getElementById("background-music");
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => console.error("Audio play failed:", error));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    const audio = document.getElementById("background-music");
    audio.volume = newValue / 100;
    setVolume(newValue);
  };

  const toggleTimer = () => {
    const audio = document.getElementById("background-music");
    if (isActive) {
      audio.pause();
    } else {
      if (isMusicPlaying) {
        audio.play().catch((error) => console.error("Audio play failed:", error));
      }
    }
    setIsActive(!isActive);
  };

  return (
    <div style={{ backgroundColor: "#181818", color: "#fff", minHeight: "100vh" }}>
      <audio id="background-music" loop onError={(e) => console.error("Audio error:", e)}>
        <source src={rainSound} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      <AppBar position="static" style={{ backgroundColor: "#1f1f1f", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Current" />
          <Tab label="Plan" />
          <Tab label="Pomodoro" />
          <Tab label="Habits" />
        </Tabs>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "8px 15px",
            cursor: "pointer",
            borderRadius: "5px",
            fontSize: "14px",
            marginRight: "15px",
          }}
        >
          Logout
        </button>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && <CurrentTab />}
        {selectedTab === 1 && <PlanTab />}
        {selectedTab === 2 && (
          <PomodoroTab
            workTime={workTime}
            setWorkTime={setWorkTime}
            restTime={restTime}
            setRestTime={setRestTime}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            isActive={isActive}
            toggleTimer={toggleTimer}
            isWorkTime={isWorkTime}
            setIsWorkTime={setIsWorkTime}
            isMusicPlaying={isMusicPlaying}
            toggleMusic={toggleMusic}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
          />
        )}
        {selectedTab === 3 && <HabitsTab />}
      </Box>
    </div>
  );
};

export default App;
