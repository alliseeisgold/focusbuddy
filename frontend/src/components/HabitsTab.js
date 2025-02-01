  import React, { useState } from "react";
  import {
    Typography,
    Button,
    Box,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Fab,
    IconButton,
  } from "@mui/material";
  import AddIcon from "@mui/icons-material/Add";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import CancelIcon from "@mui/icons-material/Cancel";
  import DeleteIcon from "@mui/icons-material/Delete";
  import { motion, AnimatePresence } from "framer-motion";

  function HabitsTab() {
    const [habits, setHabits] = useState([]); // List of habits
    const [openDialog, setOpenDialog] = useState(false); // Form dialog state
    const [newHabit, setNewHabit] = useState({
      title: "",
      description: "",
      type: "good", // Default to 'good' habit
    });

    // Open the form dialog
    const handleOpenDialog = () => {
      setNewHabit({ title: "", description: "", type: "good" }); // Reset form
      setOpenDialog(true);
    };

    // Close the form dialog
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    // Handle form input changes
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setNewHabit({ ...newHabit, [name]: value });
    };

    // Add a new habit
    const handleAddHabit = () => {
      if (!newHabit.title.trim()) {
        alert("Title is required!");
        return;
      }
      setHabits([...habits, { ...newHabit, id: Date.now() }]);
      handleCloseDialog();
    };

    // Delete a habit
    const handleDeleteHabit = (id) => {
      setHabits(habits.filter((habit) => habit.id !== id));
    };

    // Separate good and bad habits
    const goodHabits = habits.filter((habit) => habit.type === "good");
    const badHabits = habits.filter((habit) => habit.type === "bad");

    return (
      <Box sx={{ p: 3, position: "relative", minHeight: "80vh" }}>
        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenDialog}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>

        {/* Empty State with Motivational Quote */}
        {habits.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
              background: "linear-gradient(135deg, #1f1f1f, #121212)",
              borderRadius: "12px",
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "transparent",
                background: "linear-gradient(135deg, #90caf9, #f48fb1)",
                backgroundClip: "text",
                mb: 2,
              }}
            >
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </Typography>
            <Typography variant="body1" color="text.secondary">
              — Aristotle
            </Typography>
          </Box>
        )}

        {/* Good Habits List */}
        {goodHabits.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Good Habits
            </Typography>
            <List>
              {goodHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: "12px",
                      borderLeft: `6px solid #4caf50`,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: "#4caf50" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#fff" }}
                          >
                            {habit.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {habit.description}
                          </Typography>
                        }
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteHabit(habit.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  </Paper>
                </motion.div>
              ))}
            </List>
          </Box>
        )}

        {/* Bad Habits List */}
        {badHabits.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: "#f44336",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Bad Habits
            </Typography>
            <List>
              {badHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: "12px",
                      borderLeft: `6px solid #f44336`,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <CancelIcon sx={{ color: "#f44336" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#fff" }}
                          >
                            {habit.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {habit.description}
                          </Typography>
                        }
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteHabit(habit.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  </Paper>
                </motion.div>
              ))}
            </List>
          </Box>
        )}

        {/* Add Habit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              background: "linear-gradient(135deg, #1f1f1f, #121212)",
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #90caf9, #f48fb1)",
              backgroundClip: "text",
              color: "transparent",
              fontWeight: "bold",
            }}
          >
            Add New Habit
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              name="title"
              value={newHabit.title}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputLabelProps={{
                sx: { color: "#90caf9" },
              }}
              InputProps={{
                sx: { color: "#fff" },
              }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              name="description"
              value={newHabit.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputLabelProps={{
                sx: { color: "#90caf9" },
              }}
              InputProps={{
                sx: { color: "#fff" },
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#90caf9" }}>Type</InputLabel>
              <Select
                name="type"
                value={newHabit.type}
                onChange={handleInputChange}
                label="Type"
                sx={{ color: "#fff" }}
              >
                <MenuItem value="good">Good Habit</MenuItem>
                <MenuItem value="bad">Bad Habit</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddHabit} color="primary">
              Add Habit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  export default HabitsTab;