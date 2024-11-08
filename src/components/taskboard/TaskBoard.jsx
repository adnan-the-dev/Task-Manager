import axios from "axios";
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation } from "react-router-dom";
import { Box, Button } from "@mui/material";
import StageDialog from "../stageDialog/StageDialog";
import Stage from "./Stage";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const TaskBoard = ({ fetchProjects }) => {
  const [openStageDialog, setOpenStageDialog] = useState(false);
  const [stages, setStages] = useState([]);
  const [pageState, setPageState] = useState({});
  const limit = 10;
  const [loading, setLoading] = useState(false);

  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";
  const location = useLocation();
  const projectId = location.pathname.split("/").pop();

  const moveTask = async (taskId, newStageId) => {
    try {
      const res = await axios.put(`${baseUrl}/task/${taskId}/move`, {
        stage: newStageId,
      });
      return true;
    } catch (err) {
      toast.error("Error moving task:", err);
      return false;
    }
  };

  // const fetchStagesWithTask = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(`${baseUrl}/stage/${projectId}/stages`);
  //     setgetAllStage(res.data);
  //   } catch (err) {
  //     console.error("Error fetching projects:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (projectId) {
  //     fetchStagesWithTask();
  //   } else {
  //     console.error("No project ID found in URL");
  //   }
  // }, [projectId]);

  const fetchStagesWithTasks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/stage/${projectId}/stages`, {
        params: { page, limit },
      });
      setStages(res.data);
    } catch (err) {
      console.error("Error fetching stages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchStagesWithTasks();
    } else {
      console.error("No project ID found in URL");
    }
  }, [projectId]);

  const handleSeeMore = async (stageId) => {
    setLoading(true);
    const nextPage = (pageState[stageId] || 1) + 1;
    try {
      const res = await axios.get(`${baseUrl}/stage/${projectId}/stages`, {
        params: { page: nextPage, limit },
      });
      const updatedStages = stages.map((stage) => {
        if (stage._id === stageId) {
          return {
            ...stage,
            tasks: [
              ...stage.tasks,
              ...res.data.find((s) => s._id === stageId).tasks,
            ],
            pagination: res.data.find((s) => s._id === stageId).pagination,
          };
        }
        return stage;
      });
      setStages(updatedStages);
      setPageState({
        ...pageState,
        [stageId]: nextPage,
      });
    } catch (err) {
      console.error("Error fetching more tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageDialogOpen = () => {
    setOpenStageDialog(true);
  };

  const handleStageDialogClose = () => {
    setOpenStageDialog(false);
  };

  return (
    <>
      <div
        style={{
          borderBottom: "1px solid gray",
          // borderRadius: " 5px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleStageDialogOpen}
          >
            Add Stage
          </Button>
          <StageDialog
            open={openStageDialog}
            onClose={handleStageDialogClose}
            id={projectId}
            updateProject={fetchStagesWithTasks}
          />
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div style={styles.board}>
          {loading ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <CircularProgress size={30} />
            </Box>
          ) : Array.isArray(stages) && stages.length === 0 ? (
            <p>No tasks available for this project.</p>
          ) : (
            stages.map((stage) => (
              <Stage
                key={stage.id}
                stage={stage}
                tasks={stage.tasks}
                moveTask={moveTask}
                updateProject={fetchStagesWithTasks}
                updateAllProject={fetchProjects}
                handleSeeMore={handleSeeMore}
              />
            ))
          )}
        </div>
      </DndProvider>
    </>
  );
};

// Styles for the app (you can style this however you want)
const styles = {
  // board: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   padding: "20px",
  //   gap: "1rem",
  //   border:'1px solid red'
  // },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    padding: "20px",
  },
};

export default TaskBoard;
