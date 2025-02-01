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
  CircularProgress,
  Alert,
} from "@mui/material";
import { AddCircle, Delete, Check, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import chillGuy from "../assets/chill-guy-pool-edition.jpg";

const API_URL = "http://localhost:8080/api/v1/tasks";

const CurrentTab = () => {
  const [tasks, setTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    } else {
      fetchTasks();
    }
  }, [token, navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/signin");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        // Предполагаем, что сервер возвращает свойство isCompleted
        setTasks(data.filter((task) => !task.isCompleted));
        setFinishedTasks(data.filter((task) => task.isCompleted));
      } else {
        setError("Failed to load tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Error fetching tasks");
    }
    setLoading(false);
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const response = await fetch(`${API_URL}/current`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        setOpenDialog(false);
        setNewTask({ title: "", description: "" });
        fetchTasks();
      } else {
        setError("Error adding task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Error adding task");
    }
  };

  const handleEditTask = async () => {
    if (!editingTask?.title.trim()) return;
    try {
      const response = await fetch(`${API_URL}/update/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTask),
      });
      if (response.ok) {
        setEditDialog(false);
        setEditingTask(null);
        fetchTasks();
      } else {
        setError("Error updating task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Error updating task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchTasks();
      } else {
        setError("Error deleting task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Error deleting task");
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchTasks();
      } else {
        setError("Error completing task");
      }
    } catch (err) {
      console.error("Error completing task:", err);
      setError("Error completing task");
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddCircle />} onClick={() => setOpenDialog(true)}>
          Add Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tasks.length === 0 && finishedTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>
                No tasks for today. Grab a coffee or chill like this cool guy. 🍵
              </Typography>
              <Box
                component="img"
                src={chillGuy}
                alt="Chill Guy"
                sx={{ height: 400, mt: 2 }}
              />
            </Box>
          ) : (
            <>
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
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                          <Check />
                        </Button>
                        <Button
                          color="info"
                          onClick={() => {
                            setEditingTask(task);
                            setEditDialog(true);
                          }}
                        >
                          <Edit />
                        </Button>
                        <Button color="error" onClick={() => handleDeleteTask(task.id)}>
                          <Delete />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              {finishedTasks.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" color="secondary">
                    Finished Tasks:
                  </Typography>
                  <Divider sx={{ my: 1, backgroundColor: "#4a4a4a" }} />
                  {finishedTasks.map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        mt: 2,
                        backgroundColor: "#1f1f1f",
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                      </Box>
                      <Button color="error" onClick={() => handleDeleteTask(task.id)}>
                        <Delete />
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </>
      )}

      {/* Диалог добавления новой задачи */}
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
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddTask} color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования задачи */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingTask?.title || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editingTask?.description || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditTask} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CurrentTab;
