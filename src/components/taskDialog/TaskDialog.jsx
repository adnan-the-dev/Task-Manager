import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const TaskDialog = ({ open, onClose, onSave, id, updateProject }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, value) => {
    setSelectedUser(value ? value._id : null);
  };

  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${baseUrl}/user`);
      const result = await response.json();

      if (Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        console.error(
          "API response does not contain a valid data array:",
          result
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "description") setDescription(value);
    if (name === "dueDate") setDueDate(value);
  };
  const getDate = (dateString) => dateString.split("T")[0];

  const validateForm = () => {
    let isValid = true;

    if (!title) {
      toast.error("Title is required");
      isValid = false;
    }
    if (!description) {
      toast.error("Description is required");
      isValid = false;
    }
    if (!dueDate) {
      toast.error("Due date is required");
      isValid = false;
    }
    if (!selectedUser) {
      toast.error("Assigned user is required");
      isValid = false;
    }

    return isValid;
  };

  const handleAddStage = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const stageData = {
      title: title,
      description,
      dueDate: getDate(dueDate),
      stageId: id,
      assignedUserId: selectedUser,
    };
    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/task`, stageData);
      toast.success(res.data.message);
      await updateProject();
      setTitle("");
      setDescription("");
      setDueDate("");
      setSelectedUser(null);
      onClose();
    } catch (err) {
      console.error("Error adding project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          name="title"
          value={title}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Description"
          fullWidth
          name="description"
          value={description}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Due Date"
          fullWidth
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Select User" variant="outlined" />
          )}
          onChange={handleChange}
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
            "Add Task"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
