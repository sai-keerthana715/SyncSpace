import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Workspace() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {workspace && (
        <>
          <div className="mb-8 text-center">
            <Typography variant="h4" className="mb-2 font-bold text-indigo-700 drop-shadow-sm">
              {workspace.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" className="text-gray-600">
              {workspace.description}
            </Typography>
          </div>

          {/* Task creation form */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
            <TextField
              label="Task title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white w-60"
            />
            <TextField
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white w-80"
            />
            <Button
              variant="contained"
              onClick={createTask}
              sx={{
                background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                },
                borderRadius: "8px",
                px: 3,
              }}
            >
              Create Task
            </Button>
          </div>

          {/* Tasks list */}
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className={`transition-all transform hover:scale-[1.02] hover:shadow-xl rounded-2xl border-l-8 ${
                  task.completed
                    ? "border-green-500 bg-green-50"
                    : "border-yellow-400 bg-white"
                }`}
                sx={{ boxShadow: 3 }}
              >
                <CardContent>
                  <Typography variant="h6" className="font-semibold text-gray-800 mb-1">
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-3">
                    {task.description || "No description"}
                  </Typography>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="small"
                      onClick={() => toggleTaskStatus(task._id, task.completed)}
                      variant={task.completed ? "outlined" : "contained"}
                      color={task.completed ? "success" : "warning"}
                    >
                      {task.completed ? "Mark Undone" : "Mark Done"}
                    </Button>

                    <Button
                      size="small"
                      color="info"
                      onClick={() => editTask(task._id)}
                      variant="outlined"
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => deleteTask(task._id)}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                    <Button
  variant="contained"
  color="primary"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/docs/${workspace._id}`,
        { title: `${workspace.name} - Notes` },
        { headers: { Authorization: "Bearer " + token } }
      );
      navigate(`/member/document/${res.data._id}`);
    } catch (err) {
      console.error("❌ Error creating/opening document:", err);
      alert("Error opening document editor");
    }
  }}
>
  Open Document Editor
</Button>


                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
