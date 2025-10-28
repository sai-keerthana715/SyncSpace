import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Chip, Divider } from "@mui/material";
import { Link } from "react-router-dom";

export default function MyWorkspaces() {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    loadMyWorkspaces();
  }, []);

  async function loadMyWorkspaces() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/member/workspaces", {
        headers: { Authorization: "Bearer " + token },
      });
      setWorkspaces(res.data);
    } catch (err) {
      console.error("Error loading workspaces:", err);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">My Workspaces</h2>

      {workspaces.length === 0 ? (
        <Typography className="text-gray-600">No workspaces assigned yet.</Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => {
            const totalTasks = ws.tasks?.length || 0;
            const completedTasks = ws.tasks?.filter((t) => t.completed).length || 0;

            return (
              <Card
                key={ws._id}
                className="shadow-md border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800 mb-2"
                  >
                    {ws.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-4">
                    {ws.description || "No description provided."}
                  </Typography>

                  <Divider className="mb-3" />

                  {/* Task summary */}
                  <div className="flex items-center justify-between mb-3">
                    <Typography variant="body2" className="text-gray-500">
                      {totalTasks} Tasks
                    </Typography>
                    {totalTasks > 0 && (
                      <Typography variant="body2" className="text-sm text-gray-500">
                        {completedTasks} Completed
                      </Typography>
                    )}
                  </div>

                  {/* Small task preview chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ws.tasks?.slice(0, 3).map((task, i) => (
                      <Chip
                        key={i}
                        label={task.title}
                        size="small"
                        className={`${
                          task.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      />
                    ))}
                    {ws.tasks?.length > 3 && (
                      <Chip
                        label={`+${ws.tasks.length - 3} more`}
                        size="small"
                        className="bg-gray-100 text-gray-600"
                      />
                    )}
                  </div>

                  {/* Button */}
                  <Link to={`/workspace/${ws._id}`}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      className="w-full"
                    >
                      Open Workspace
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
