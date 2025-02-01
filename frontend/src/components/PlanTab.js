import React, { useState } from "react";
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
import EditIcon from "@mui/icons-material/Edit";

function PlanTab() {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [errors, setErrors] = useState({ title: false, dueDate: false }); // State for error handling

  // Открытие и закрытие диалога
  const handleOpenDialog = () => {
    setNewTask({ title: "", description: "", dueDate: "" });
    setErrors({ title: false, dueDate: false }); // Reset errors
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Открытие и закрытие диалога редактирования
  const handleOpenEditDialog = (task) => {
    setEditingTask(task);
    setErrors({ title: false, dueDate: false }); // Reset errors
    setEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialog(false);
  };

  // Добавление задачи
  const handleAddTask = () => {
    const newErrors = { title: !newTask.title.trim(), dueDate: !newTask.dueDate };
    setErrors(newErrors);

    if (newErrors.title || newErrors.dueDate) {
      return; // Stop if there are errors
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
      },
    ]);
    handleCloseDialog();
  };

  // Редактирование задачи
  const handleEditTask = () => {
    const newErrors = { title: !editingTask.title.trim(), dueDate: !editingTask.dueDate };
    setErrors(newErrors);

    if (newErrors.title || newErrors.dueDate) {
      return; // Stop if there are errors
    }

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: editingTask.title,
              description: editingTask.description,
              dueDate: editingTask.dueDate,
            }
          : task
      )
    );
    handleCloseEditDialog();
  };

  // Удаление задачи
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Кнопка "Add Task" наверху */}
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

      {/* Если задач нет, ничего не отображаем */}
      {tasks.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No tasks planned.
          </Typography>
        </Box>
      )}

      {/* Если задачи есть, отображаем их */}
      {tasks.length > 0 && (
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
                <Button
                  color="info"
                  onClick={() => handleOpenEditDialog(task)}
                >
                  <EditIcon />
                </Button>
                <Button
                  color="error"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Диалог для добавления задачи */}
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
            error={errors.title}
            helperText={errors.title ? "Title is required" : ""}
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
            error={errors.dueDate}
            helperText={errors.dueDate ? "Due Date is required" : ""}
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
            error={errors.title}
            helperText={errors.title ? "Title is required" : ""}
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
            error={errors.dueDate}
            helperText={errors.dueDate ? "Due Date is required" : ""}
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