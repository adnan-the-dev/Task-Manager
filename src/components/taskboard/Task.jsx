import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useDrag } from "react-dnd";
import { toast } from "react-toastify";
import { IconButton, Tooltip } from "@mui/material";

const Task = ({ task, updateProject, ind }) => {
  const [, drag] = useDrag(() => ({
    type: "TASK",
    item: task,
  }));

  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";

  const deleteTask = async (deleteTaskId) => {
    try {
      const res = await axios.delete(`${baseUrl}/task/${deleteTaskId}`);
      toast.success(res.data.message);
      await updateProject();
    } catch (err) {
      console.error("Error deleting stage:", err);
    }
  };

  return (
    <div ref={drag} style={styles.task}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p>{ind + 1}</p>
        <p>{task.title}</p>
        <Tooltip title="Delete Task" arrow>
          <IconButton onClick={() => deleteTask(task._id)}>
            <DeleteIcon
              sx={{ cursor: "pointer", color: "red", fontSize: "20px" }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Task;

const styles = {
  task: {
    padding: "8px",
    marginBottom: "8px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    cursor: "move",
  },
};
