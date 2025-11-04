import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";

const socket = io("http://localhost:5000");

export default function KanbanBoard() {
  const { id: workspaceId } = useParams(); // workspace id
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    // load tasks
    loadWorkspaceTasks();

    // join workspace room for realtime updates
    socket.emit("join_workspace", workspaceId);

    // Listen for task updates from server
    socket.on("task_updated", (payload) => {
      if (!mountedRef.current) return;
      if (payload.workspaceId !== workspaceId) return;
      setTasks(prev => prev.map(t => (String(t._id) === String(payload.taskId) ? { ...t, status: payload.status, completed: payload.completed } : t)));
    });

    return () => {
      mountedRef.current = false;
      socket.off("task_updated");
      // optionally leave room
      // socket.emit('leave_workspace', workspaceId);
    };
  }, [workspaceId]);

  async function loadWorkspaceTasks() {
    try {
      const res = await axios.get(`http://localhost:5000/api/member/workspaces/${workspaceId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const ws = res.data;
      setTasks(ws.tasks || []);
    } catch (err) {
      console.error("Error loading workspace:", err);
    }
  }

  async function updateTaskStatus(taskId, newStatus) {
    try {
      await axios.patch(
        `http://localhost:5000/api/member/workspaces/${workspaceId}/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: "Bearer " + token } }
      );
      // server emits update; we optimistically update too
      setTasks(prev => prev.map(t => (String(t._id) === String(taskId) ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  }

  const columns = {
    todo: { title: "To Do" },
    inprogress: { title: "In Progress" },
    done: { title: "Done" },
  };

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    // optimistic update
    setTasks(prev => prev.map(t => (t._id === draggableId ? { ...t, status: newStatus } : t)));
    updateTaskStatus(draggableId, newStatus);
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-3xl font-bold text-blue-700 mb-8 tracking-wide text-center">🗂 Kanban Board</Typography>
        <div>
          <Link to={`/workspace/${workspaceId}`}>
            <Button variant="outlined" size="small">Open Workspace</Button>
          </Link>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(columns).map(([colKey, col]) => (
            <Droppable droppableId={colKey} key={colKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="rounded-2xl shadow-md border-2 p-5 backdrop-blur-sm bg-white/80 hover:shadow-lg transition-all duration-300"
                >
                  <Typography variant="h6" className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4 text-center">{col.title}</Typography>

                  {tasks
                    .filter((t) => t.status === colKey)
                    .map((task, index) => (
                      <Draggable draggableId={String(task._id)} index={index} key={String(task._id)}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 cursor-grab hover:scale-[1.03] hover:shadow-md transition-transform duration-200`}
                          >
                            <CardContent>
                              <Typography variant="subtitle1" className="font-medium text-gray-800">{task.title}</Typography>
                              <Typography variant="body2" className="text-sm text-gray-500 mt-1">{task.description}</Typography>
                              <div className="mt-2">
                                <small className="text-xs text-gray-500">Created: {new Date(task.createdAt).toLocaleString()}</small>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                  {tasks.filter(t => t.status === colKey).length === 0 && (
                    <div className="text-gray-400 text-center italic mt-6">No tasks</div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
