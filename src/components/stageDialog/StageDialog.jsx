import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const StageDialog = ({ open, onClose, onSave, id, updateProject }) => {
  const [stageName, setStageName] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";

  const handleInputChange = (event) => {
    setStageName(event.target.value);
  };
  const handleAddStage = async (e) => {
    e.preventDefault();

    if (!stageName) {
      toast.error("Please enter a stage name");
      return;
    }

    try {
      const newStageAdd = { name: stageName, projectId: id };
      try {
        setLoading(true);
        const res = await axios.post(`${baseUrl}/stage`, newStageAdd);
        toast.success(res.data.message);
        setStageName("");
        onClose();
        updateProject();
      } catch (err) {
        console.error("Error adding project:", err);
      }
    } catch (error) {
      toast.error("Error adding stage:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Stage</DialogTitle>
      <DialogContent>
        <TextField
          label="Stage Name"
          margin="normal"
          fullWidth
          value={stageName}
          onChange={handleInputChange}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleAddStage} color="success" variant="contained">
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Stage"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StageDialog;
