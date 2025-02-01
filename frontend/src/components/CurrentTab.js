import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import chillGuy from "../assets/chill-guy-pool-edition.jpg";

const API_URL = "http://localhost:8080/api/v1/tasks";

function CurrentTab() {
  const [tasks, setTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  console.log(token)
  // Проверяем, есть ли токен. Если нет — редиректим на логин.
  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    } else {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        console.error("Unauthorized: Redirecting to login.");
        localStorage.removeItem("access_token");
        navigate("/sign-in");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTasks(data.filter((task) => !task.completed));
        setFinishedTasks(data.filter((task) => task.completed));
      } else {
        console.error("Failed to load tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        fetchTasks();
        setOpenDialog(false);
        setNewTask({ title: "", description: "" });
      } else {
        console.error("Error adding task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async () => {
    if (!editingTask.title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/${editingTask.id}`, {
        method: "PUT", // Изменено с PATCH на PUT для совместимости
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTask),
      });

      if (response.ok) {
        fetchTasks();
        setEditDialog(false);
        setEditingTask(null);
      } else {
        console.error("Error updating task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Error deleting task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/complete`, {
        method: "PUT", // Изменено с PATCH на PUT для лучшей поддержки API
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Error completing task");
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Task
        </Button>
      </Box>

      {tasks.length === 0 && finishedTasks.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>
            No tasks for today. Grab a coffee or chill like this cool guy. 🍵
          </Typography>
          <img
            src={chillGuy}
            alt="Chill Guy"
            style={{ width: "auto", height: "400px", marginTop: "20px" }}
          />
        </Box>
      )}

      {tasks.length > 0 && (
        <Box>
          <Typography variant="h6">Today's Tasks:</Typography>
          {tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                mt: 2,
                backgroundColor: "#292929",
                p: 2,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
              </Box>
              <Box>
                <Button color="success" onClick={() => handleCompleteTask(task.id)}>
                  <CheckIcon />
                </Button>
                <Button color="info" onClick={() => { setEditDialog(true); setEditingTask(task); }}>
                  <EditIcon />
                </Button>
                <Button color="error" onClick={() => handleDeleteTask(task.id)}>
                  <DeleteIcon />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {finishedTasks.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="secondary">
            Finished:
          </Typography>
          <Divider sx={{ my: 1, backgroundColor: "#4a4a4a" }} />
          {finishedTasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                mt: 2,
                backgroundColor: "#1f1f1f",
                p: 2,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
              </Box>
              <Box>
                <Button color="error" onClick={() => handleDeleteTask(task.id)}>
                  <DeleteIcon />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddTask} color="primary">Add Task</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CurrentTab;
