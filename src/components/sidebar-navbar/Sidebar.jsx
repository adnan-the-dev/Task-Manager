import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import ProjectDialog from "./ProjectDialog";
import { toast } from "react-toastify";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Sidebar({
  projects,
  fetchProjects,
  children,
  loading,
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const baseUrl =
    import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3300";

  const location = useLocation();
  const projectId = location.pathname.split("/").pop();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const deleteProject = async (projectToDelete) => {
    try {
      const res = await axios.delete(`${baseUrl}/project/${projectToDelete}`);
      toast.success(res.data.message);
      fetchProjects();
    } catch (err) {
      toast.error("Error deleting project:", err);
    }
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Task Manager</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography>Add Project</Typography>
          <Tooltip title="Add project" arrow>
            <IconButton onClick={handleDialogOpen}>
              <AddIcon sx={{ color: "green" }} />
            </IconButton>
          </Tooltip>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
        </DrawerHeader>
        {/* Dialog Modal */}
        <ProjectDialog
          open={openDialog}
          onClose={handleDialogClose}
          updateProject={fetchProjects}
        />
        <Divider />
        <List>
          {loading ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <CircularProgress size={30} />
            </Box>
          ) : (
            projects?.data?.map((text, index) => (
              <>
                <ListItem
                  key={text._id}
                  disablePadding
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                      projectId === text._id
                        ? "rgba(0, 123, 255, 0.1)"
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        projectId === text._id
                          ? "rgba(0, 123, 255, 0.15)"
                          : "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <ListItemButton
                    component={Link}
                    to={`/projects/${text._id}`}
                    // onClick={() => handleSelect(text._id)}
                  >
                    <ListItemIcon>
                      <AccountTreeIcon />
                    </ListItemIcon>
                    <ListItemText primary={text.name} />
                  </ListItemButton>
                  <Tooltip title="Delete Project" arrow>
                    <IconButton onClick={() => deleteProject(text._id)}>
                      <DeleteIcon
                        sx={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "20px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
              </>
            ))
          )}
        </List>
        {/* <Divider /> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
