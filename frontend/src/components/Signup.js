import React, { useState } from "react";
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => { // ✅ Передаем setIsAuthenticated как пропс
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [usernameHelperText, setUsernameHelperText] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUsernameError(false);
    setConfirmPasswordError(false);
    setUsernameHelperText("");

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    const signupData = { username, password, confirmPassword, telegramId };

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🔐 Токен, полученный при регистрации:", data.accessToken);

        // ✅ Сохраняем токен
        localStorage.setItem("access_token", data.accessToken);

        // ✅ Обновляем состояние авторизации
        setIsAuthenticated(true);

        // ✅ Перенаправляем на главную страницу
        navigate("/");
      } else if (response.status === 409) {
        setUsernameError(true);
        setUsernameHelperText("Username already exists! Try another one.");
      } else {
        console.error("❌ Signup failed.");
      }
    } catch (error) {
      console.error("❌ Server error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#181818",
        color: "#fff",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "300px",
        }}
      >
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          error={usernameError}
          helperText={usernameHelperText}
        />
        <TextField
          label="Telegram ID"
          type="text"
          variant="outlined"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          error={confirmPasswordError}
          helperText={confirmPasswordError ? "Passwords do not match." : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Signup
        </Button>
        <Button variant="text" color="secondary" onClick={() => navigate("/")}>
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
