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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/v1/tasks";

function PlanTab() {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [errors, setErrors] = useState({ title: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    setErrorMsg("");
    try {
      const response = await fetch(`${API_URL}/planned`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/sign-in");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setErrorMsg("Failed to load tasks.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setErrorMsg("Error fetching tasks.");
    }
    setLoading(false);
  };

  // Функция валидации: проверяет, что заголовок не пустой и дата установлена правильно
  const validateTask = (task) => {
    let titleError = "";
    let dueDateError = "";

    if (!task.title.trim()) {
      titleError = "Title is required";
    }

    if (!task.dueDate) {
      dueDateError = "Due Date is required";
    } else {
      const selectedDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selectedDate.getTime())) {
        dueDateError = "Invalid date format";
      } else if (selectedDate < today) {
        dueDateError = "Due date must be today or in the future";
      }
    }

    return { titleError, dueDateError };
  };

  // Открытие/закрытие диалога добавления
  const handleOpenDialog = () => {
    setNewTask({ title: "", description: "", dueDate: "" });
    setErrors({ title: "", dueDate: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Открытие/закрытие диалога редактирования
  const handleOpenEditDialog = (task) => {
    setEditingTask(task);
    setErrors({ title: "", dueDate: "" });
    setEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialog(false);
  };

  // Добавление задачи через API
  const handleAddTask = async () => {
    const { titleError, dueDateError } = validateTask(newTask);
    setErrors({ title: titleError, dueDate: dueDateError });
    if (titleError || dueDateError) return;

    try {
      const response = await fetch(`${API_URL}/planned`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        await fetchTasks();
        handleCloseDialog();
      } else {
        setErrorMsg("Error adding task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setErrorMsg("Error adding task.");
    }
  };

  // Редактирование задачи через API
  const handleEditTask = async () => {
    if (!editingTask) return;
    const { titleError, dueDateError } = validateTask(editingTask);
    setErrors({ title: titleError, dueDate: dueDateError });
    if (titleError || dueDateError) return;

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
        await fetchTasks();
        handleCloseEditDialog();
      } else {
        setErrorMsg("Error updating task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setErrorMsg("Error updating task.");
    }
  };

  // Удаление задачи через API
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchTasks();
      } else {
        setErrorMsg("Error deleting task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMsg("Error deleting task.");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Кнопка добавления задачи */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleOpenDialog}
        >
          Add Task
        </Button>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tasks.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="h6" color="text.secondary">
                No tasks planned.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">Planned Tasks:</Typography>
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
                    <Typography variant="body2" color="text.secondary">
                      Due Date: {task.dueDate || "No due date set"}
                    </Typography>
                  </Box>
                  <Box>
                    <Button color="info" onClick={() => handleOpenEditDialog(task)}>
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
        </>
      )}

      {/* Диалог для добавления новой задачи */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            required
            error={Boolean(errors.title)}
            helperText={errors.title}
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            required
            error={Boolean(errors.dueDate)}
            helperText={errors.dueDate}
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddTask} color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог для редактирования задачи */}
      <Dialog open={editDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            required
            error={Boolean(errors.title)}
            helperText={errors.title}
            value={editingTask?.title || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editingTask?.description || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            required
            error={Boolean(errors.dueDate)}
            helperText={errors.dueDate}
            InputLabelProps={{ shrink: true }}
            value={editingTask?.dueDate || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, dueDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditTask} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PlanTab;
