import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    telegramId: "",
  });
  const [errors, setErrors] = useState({ username: false, confirmPassword: false });
  const [helperText, setHelperText] = useState({ username: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: false, confirmPassword: false });
    setHelperText({ username: "", confirmPassword: "" });

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: true }));
      setHelperText((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.accessToken);
        setIsAuthenticated(true);
        navigate("/");
      } else if (response.status === 409) {
        setErrors((prev) => ({ ...prev, username: true }));
        setHelperText((prev) => ({
          ...prev,
          username: "Username already exists! Try another one.",
        }));
      } else {
        console.error("Signup failed.");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#181818",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "320px",
          bgcolor: "#282828",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center">
          Sign Up
        </Typography>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          value={formData.username}
          onChange={handleChange}
          required
          fullWidth
          error={errors.username}
          helperText={helperText.username}
          InputLabelProps={{ style: { color: "#fff" } }}
          inputProps={{ style: { color: "#fff" } }}
        />
        <TextField
          label="Telegram ID"
          name="telegramId"
          variant="outlined"
          value={formData.telegramId}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ style: { color: "#fff" } }}
          inputProps={{ style: { color: "#fff" } }}
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
          InputLabelProps={{ style: { color: "#fff" } }}
          inputProps={{ style: { color: "#fff" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#fff" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          fullWidth
          error={errors.confirmPassword}
          helperText={errors.confirmPassword ? "Passwords do not match." : ""}
          InputLabelProps={{ style: { color: "#fff" } }}
          inputProps={{ style: { color: "#fff" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#fff" }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        <Button variant="text" color="secondary" onClick={() => navigate("/")}>
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
