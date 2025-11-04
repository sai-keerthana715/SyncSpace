  import React, { useState, useEffect } from "react";
  import axios from "axios";

  export default function MemberDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const [assigned, setAssigned] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadAssignedWorkspaces();
    }, []);

    async function loadAssignedWorkspaces() {
      try {
        const res = await axios.get("http://localhost:5000/api/member/workspaces", {
    headers: { Authorization: "Bearer " + token },
  });
  const userId = user._id;
    const formatted = res.data.map(ws => {
      const response = ws.memberResponses?.find(r =>
        r.member === userId || r.member?._id === userId
      );
      return { ...ws, response: response ? response.response : "pending" };
    });

         setAssigned(formatted);
  } catch (err) {
    console.error("❌ Error loading assigned workspaces:", err);
  } finally {
    setLoading(false);
  }
}

    async function handleResponse(id, action) {
      try {
        await axios.post(
          `http://localhost:5000/api/member/workspaces/${id}/response`,
          { action },
          { headers: { Authorization: "Bearer " + token } }
        );

        // ✅ Instantly update UI
        setAssigned((prev) =>
          prev.map((w) =>
            w._id === id ? { ...w, response: action } : w
          )
        );
      } catch (err) {
        console.error("❌ Error sending response:", err);
      }
    }

    if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {user?.name}</h2>
        <p className="text-gray-600 mb-6">
          Below are your assigned workspaces. Accept or reject invitations.
        </p>

        {assigned.length === 0 ? (
          <p className="text-gray-500">No assigned workspaces yet.</p>
        ) : (
          assigned.map((ws) => (
            <div
              key={ws._id}
              className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-xl font-medium text-blue-600">{ws.name}</h3>
              <p className="text-gray-600 mb-2">{ws.description}</p>

              {ws.response === "accept" ? (
                <span className="text-green-600 font-semibold">✅ Accepted</span>
              ) : ws.response === "reject" ? (
                <span className="text-red-500 font-semibold">❌ Rejected</span>
              ) : (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleResponse(ws._id, "accept")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(ws._id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  }
