import * as React from "react";
import Sidebar from "./components/sidebar-navbar/Sidebar";
import axios from "axios";
import TaskBoard from "./components/taskboard/TaskBoard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export function App() {
  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/project`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Router>
        <Sidebar projects={projects} fetchProjects={fetchProjects} loading={loading}>
          <Routes>
            <Route
              path="/"
              element={<h2>Select a project to view details</h2>}
            />
            <Route
              path="/projects/:projectId"
              element={<TaskBoard fetchProjects={fetchProjects} />}
            />
          </Routes>
        </Sidebar>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000} // Auto-close after 5 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
