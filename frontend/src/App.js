import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AppBar, Tabs, Tab, Box, Button, ThemeProvider, Typography } from "@mui/material";
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("access_token"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  const handleTabChange = (event, newValue) => {
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
                  handleTabChange={handleTabChange}
                  handleLogout={handleLogout}
                />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route
            path="/signin"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/signup"
            element={<Signup setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const MainPage = ({ selectedTab, handleTabChange, handleLogout }) => {
  const [workTime, setWorkTime] = useState(25);
  const [restTime, setRestTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      setIsWorkTime((prev) => !prev);
      setTimeLeft(isWorkTime ? restTime * 60 : workTime * 60);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isWorkTime, workTime, restTime]);

  const toggleMusic = () => {
    const audio = document.getElementById("background-music");
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Audio play error:", err));
    }
    setIsMusicPlaying((prev) => !prev);
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
    } else if (isMusicPlaying) {
      audio.play().catch((err) => console.error("Audio play error:", err));
    }
    setIsActive((prev) => !prev);
  };

  return (
    <Box sx={{ bgcolor: "#181818", minHeight: "100vh", color: "#fff" }}>
      <audio id="background-music" loop>
        <source src={rainSound} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#1f1f1f",
          p: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ flexGrow: 1 }}
        >
          <Tab label="Current" />
          <Tab label="Plan" />
          <Tab label="Pomodoro" />
          <Tab label="Habits" />
        </Tabs>
        <Button onClick={handleLogout} variant="contained" color="error" sx={{ ml: 2 }}>
          Logout
        </Button>
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
    </Box>
  );
};

export default App;
