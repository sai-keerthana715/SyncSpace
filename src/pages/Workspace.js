import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Workspace() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  async function loadWorkspace() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/member/workspaces/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setWorkspace(res.data);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("❌ Error loading workspace:", err.response?.status, err.response?.data || err.message);
    }
  }

  async function createTask() {
    if (!title) return alert("Enter a task title!");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/member/workspaces/${id}/tasks`,
        { title, description },
        { headers: { Authorization: "Bearer " + token } }
      );
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating task:", err);
    }
  }

  async function toggleTaskStatus(taskId, currentStatus) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/member/workspaces/${id}/tasks/${taskId}`,
        { completed: !currentStatus },
        { headers: { Authorization: "Bearer " + token } }
      );
      setTasks(tasks.map(t => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }

  async function editTask(taskId) {
  const newTitle = prompt("New title:");
  const newDesc = prompt("New description:");
  if (!newTitle && !newDesc) return;

  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:5000/api/member/workspaces/${id}/tasks/${taskId}`,
      { title: newTitle, description: newDesc },
      { headers: { Authorization: "Bearer " + token } }
    );
    setTasks(tasks.map(t => (t._id === taskId ? res.data : t)));
  } catch (err) {
    console.error("Error editing task:", err);
  }
}

async function deleteTask(taskId) {
  if (!window.confirm("Delete this task?")) return;
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/api/member/workspaces/${id}/tasks/${taskId}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    setTasks(tasks.filter(t => t._id !== taskId));
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}


  return (
    <div className="p-6">
      {workspace && (
        <>
          <Typography variant="h4" className="mb-2">{workspace.name}</Typography>
          <Typography variant="body1" color="text.secondary" className="mb-6">
            {workspace.description}
          </Typography>

          {/* Task creation form */}
          <div className="flex gap-3 mb-6">
            <TextField
              label="Task title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white"
            />
            <TextField
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white"
            />
            <Button variant="contained" onClick={createTask}>
              Create Task
            </Button>
          </div>

          {/* Tasks list */}
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className={`shadow-md border-l-4 ${
                  task.completed ? "border-green-500" : "border-yellow-400"
                }`}
              >
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => toggleTaskStatus(task._id, task.completed)}
                    variant={task.completed ? "outlined" : "contained"}
                    color={task.completed ? "success" : "warning"}
                    className="mt-3"
                  >
                    {task.completed ? "Mark Undone" : "Mark Done"}
                  </Button>
                  <Button
  size="small"
  color="info"
  onClick={() => editTask(task._id)}
>
  Edit
</Button>

<Button
  size="small"
  color="error"
  onClick={() => deleteTask(task._id)}
>
  Delete
</Button>

                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
