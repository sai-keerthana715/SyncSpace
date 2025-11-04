import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function DocumentEditor() {
  const { workspaceId, docId } = useParams(); // this is document ID (from route /member/document/:id)
  const [loading, setLoading] = useState(true);
  const [documentTitle, setDocumentTitle] = useState("");
  const token = localStorage.getItem("token");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // ✅ Load document
  useEffect(() => {
    async function loadDoc() {
      try {
        const res = await axios.get(`http://localhost:5000/api/docs/view/${id}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setDocumentTitle(res.data.title);
        editor?.commands.setContent(res.data.content || "");
      } catch (err) {
        console.error("❌ Error loading document:", err);
      } finally {
        setLoading(false);
      }
    }
    if (editor) loadDoc();
  }, [editor, id]);

  // ✅ Save document content
  async function saveDocument() {
    try {
      await axios.put(
        `http://localhost:5000/api/docs/view/${id}`,
        { content: editor.getHTML() },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("✅ Document saved successfully!");
    } catch (err) {
      console.error("❌ Error saving document:", err);
    }
  }

  if (loading) return <CircularProgress className="m-4" />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        Document: {documentTitle}
      </h2>

      <div className="bg-white rounded-lg shadow p-4">
        <EditorContent editor={editor} className="border border-gray-300 p-3 min-h-[400px] rounded-lg" />
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="contained" color="primary" onClick={saveDocument}>
          Save
        </Button>
      </div>
    </div>
  );
}
