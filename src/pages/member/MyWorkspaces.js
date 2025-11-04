import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Button, Typography } from "@mui/material";
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Workspaces
      </h2>

      {workspaces.length === 0 ? (
        <Typography className="text-center text-gray-500">
          No workspaces assigned yet.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workspaces.map((ws) => (
            <Card
              key={ws._id}
              className="shadow-lg border border-blue-100 hover:shadow-xl transition duration-300 rounded-xl bg-white"
            >
              <CardContent className="p-6">
                <Typography
                  variant="h6"
                  className="font-semibold text-blue-600 mb-2"
                >
                  {ws.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="text-gray-600 mb-4"
                >
                  {ws.description}
                </Typography>

                <div className="flex justify-between items-center gap-4 mt-5">
                  <Link to={`/workspace/${ws._id}`}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#1E40AF",
                        "&:hover": { backgroundColor: "#1E3A8A" },
                        textTransform: "none",
                        borderRadius: "8px",
                      }}
                    >
                      Open Workspace
                    </Button>
                  </Link>

                  <Link to={`/workspace/${ws._id}/kanban`}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "#1E40AF",
                        borderColor: "#1E40AF",
                        textTransform: "none",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "#DBEAFE",
                          borderColor: "#1E3A8A",
                        },
                      }}
                    >
                      Open Kanban Board
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
