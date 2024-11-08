import React from "react";
import Task from "./Task";
import TaskDialog from "../taskDialog/TaskDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDrop } from "react-dnd";
import axios from "axios";
import { Button, IconButton, Tooltip } from "@mui/material";

const Stage = ({
  stage,
  tasks,
  moveTask,
  updateProject,
  updateAllProject,
  handleSeeMore,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: async (item) => {
      if (item.stage !== stage._id && (await moveTask(item._id, stage._id))) {
        updateProject();
      }
    },
  }));

  const [openStageDialog, setOpenStageDialog] = React.useState(false);
  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";
  // Function to open the dialog
  const handleStageDialogOpen = () => {
    setOpenStageDialog(true);
  };

  // Function to close the dialog
  const handleStageDialogClose = () => {
    setOpenStageDialog(false);
  };

  const deleteStage = async (deleteStageId) => {
    try {
      const res = await axios.delete(`${baseUrl}/stage/${deleteStageId}`);
      toast.success(res.data.message);
      await updateProject();
      await updateAllProject();
    } catch (err) {
      console.error("Error deleting stage:", err);
    }
  };

  return (
    <div ref={drop} style={styles.stage}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid gray",
          height: "60px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3>{stage.name}</h3>
        <Tooltip title="Delete Stage" arrow>
          <IconButton onClick={() => deleteStage(stage._id)}>
            <DeleteIcon
              sx={{ cursor: "pointer", color: "red", fontSize: "20px" }}
            />
          </IconButton>
        </Tooltip>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          border: "1px solid gray",
          borderRadius: "5px",
          height: "40px",
          marginBottom: "10px",
          padding: "0px 5px",
        }}
      >
        <h3>Add Task</h3>
        <Tooltip title="Add task" arrow>
          <IconButton onClick={handleStageDialogOpen}>
            <AddIcon sx={{ color: "green" }} />
          </IconButton>
        </Tooltip>
      </div>

      <div style={styles.task}>
        {tasks.map((task, i) =>
          task.parentId === stage.id ? (
            <Task
              key={task.id}
              task={task}
              moveTask={moveTask}
              updateProject={updateProject}
              ind={i}
            />
          ) : null
        )}
        <div style={styles.seeMore}>
          {stage.pagination.currentPage < stage.pagination.totalPages && (
            <Button
              variant="contained"
              color="success"
              onClick={() => handleSeeMore(stage._id)}
            >
              See More
            </Button>
          )}
        </div>
      </div>

      <TaskDialog
        open={openStageDialog}
        onClose={handleStageDialogClose}
        id={stage._id}
        updateProject={updateProject}
      />
    </div>
  );
};

export default Stage;

const styles = {
  stage: {
    width: "250px",
    maxHeight: "460px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  task: {
    overflow: "auto",
    height: "100%",
    paddingBottom: "8rem",
  },
  seeMore: {
    display: "flex",
    justifyContent: "center",
    // marginTop: "10px",
  }
};
