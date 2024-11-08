import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

function ProjectDialog({ onClose, updateProject, open }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a project name");
      return;
    }
    const newProject = { name };
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/project`, newProject);
      toast.success(res.data.message);
      setName("");
      onClose();
      updateProject();
    } catch (err) {
      toast.error("Error adding project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              label="Project Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <DialogActions>
            <Button onClick={onClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="success" variant="contained">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Project"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectDialog;
