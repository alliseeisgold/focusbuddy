import React from "react";
import {
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Slider,
  IconButton,
} from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

function PomodoroTab({
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
  timeLeft,
  setTimeLeft,
  isActive,
  toggleTimer,
  isWorkTime,
  setIsWorkTime,
  isMusicPlaying,
  toggleMusic,
  volume,
  handleVolumeChange,
}) {
  // Handle work time change
  const handleWorkTimeChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setWorkTime(value);
      if (!isActive) {
        setTimeLeft(value * 60); // Reset timer if not active
      }
    }
  };

  // Handle rest time change
  const handleRestTimeChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setRestTime(value);
    }
  };

  // Reset the timer
  const resetTimer = () => {
    toggleTimer(); // Pause the timer
    setTimeLeft(isWorkTime ? workTime * 60 : restTime * 60);
  };

  // Format time (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress for the circular progress bar
  const totalTime = isWorkTime ? workTime * 60 : restTime * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#90caf9" }}>
        Pomodoro Timer
      </Typography>

      {/* Work and Rest Time Selection */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2, borderRadius: "12px", backgroundColor: "#1f1f1f" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
              Work Time (Minutes)
            </Typography>
            <TextField
              type="number"
              value={workTime}
              onChange={handleWorkTimeChange}
              inputProps={{ min: 1, style: { textAlign: "center", fontSize: "1.5rem", color: "#fff" } }}
              variant="outlined"
              disabled={isActive}
              sx={{ input: { color: "#fff" } }}
            />
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2, borderRadius: "12px", backgroundColor: "#1f1f1f" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
              Rest Time (Minutes)
            </Typography>
            <TextField
              type="number"
              value={restTime}
              onChange={handleRestTimeChange}
              inputProps={{ min: 1, style: { textAlign: "center", fontSize: "1.5rem", color: "#fff" } }}
              variant="outlined"
              disabled={isActive}
              sx={{ input: { color: "#fff" } }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Timer Display */}
      <Box sx={{ position: "relative", display: "inline-block", mb: 4 }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={200}
          thickness={4}
          sx={{ color: isWorkTime ? "#90caf9" : "#f48fb1" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", color: "#fff" }}>
            {formatTime(timeLeft)}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {isWorkTime ? "Work Time" : "Rest Time"}
          </Typography>
        </Box>
      </Box>

      {/* Timer Controls */}
      <Box sx={{ "& > *": { m: 1 } }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={isActive ? <PauseCircleFilledIcon /> : <PlayCircleFilledIcon />}
          onClick={toggleTimer}
          sx={{ borderRadius: "20px", padding: "10px 20px" }}
        >
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={resetTimer}
          sx={{ borderRadius: "20px", padding: "10px 20px" }}
        >
          Reset
        </Button>
      </Box>

      {/* Music Player */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: "#1f1f1f", borderRadius: "12px" }}>
        <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
          Relaxing Music
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconButton onClick={toggleMusic} sx={{ color: "#fff" }}>
            {isMusicPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={100}
            sx={{ width: "150px", ml: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PomodoroTab;