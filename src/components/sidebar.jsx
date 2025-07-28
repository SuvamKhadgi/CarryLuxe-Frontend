import {
  AccountBoxOutlined,
  BarChart,
  Dashboard,
  ExitToApp,
  Home,
  Medication,
  People,
  PieChart,
  Search,
  Settings,
  Timeline,
  VerifiedUser
} from "@mui/icons-material"; // Icons
import { Activity, ListOrderedIcon } from "lucide-react";
import { Profiler } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom"; // For navigation
const Side = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    localStorage.removeItem("name"); // Remove the token from local storage
    localStorage.removeItem("id"); // Remove the token from local storage
    localStorage.removeItem("role"); // Remove the token from local storage
    console.log("Token removed, logging out...");
    navigate("/"); // Navigate to the logout route
  };
  return (
    <Sidebar
      rootStyles={{
        height: "100vh",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
        // position: "fixed",
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
          LUXECARRY Admin Panel
        </h2>
        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
          Welcome, Admin!
        </p>
      </div>

      {/* Sidebar Menu */}
      <Menu
        menuItemStyles={{
          button: {
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
      >
        {/* Home */}
        <MenuItem icon={<Home />} component={<Link to="/" />}>
          Home
        </MenuItem>
        <MenuItem icon={<Dashboard />} component={<Link to="/admindashboard" />}>
          Dashboard
        </MenuItem>

        {/* Charts Submenu */}
        <SubMenu label="Charts" icon={<BarChart />}>
          <MenuItem icon={<PieChart />} component={<Link to="/admin/piechart" />}>
            Pie Chart
          </MenuItem>
          <MenuItem icon={<Timeline />} component={<Link to="/admin/barchart" />}>
            Bar Chart
          </MenuItem>
        </SubMenu>

        {/* add items */}
        <MenuItem icon={<Medication />} component={<Link to="/additems" />}>
          Add Items
        </MenuItem>

        {/* search items */}
        <MenuItem icon={<Search />} component={<Link to="/getitems" />}>
          Search Items
        </MenuItem>
        <MenuItem icon={<VerifiedUser />} component={<Link to="/allusers" />}>
          Users
        </MenuItem>
        <MenuItem icon={<ListOrderedIcon />} component={<Link to="/allorder" />}>
          Orders
        </MenuItem>

        {/* Divider */}
        <div
          style={{
            margin: "16px 0",
            borderBottom: "1px solid #e0e0e0",
          }}
        />

        {/* Settings */}
        <MenuItem icon={<Activity />} component={<Link to="/activitylogs" />}>
          Activity Logs
        </MenuItem>
        <MenuItem icon={<AccountBoxOutlined />} component={<Link to="/myprofile" />}>
          Profile
        </MenuItem>

        {/* Users */}
        <MenuItem icon={<People />} component={<Link to="/admin/contactus" />}>
          Messages
        </MenuItem>

        {/* Logout */}
        <MenuItem
          icon={<ExitToApp />}
          component={<Link to="/" />}
          style={{ color: "#ff4444" }}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar Footer */}
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          borderTop: "1px solid #e0e0e0",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <p style={{ margin: 0, color: "#666", fontSize: "0.8rem" }}>
          © 2025 Luxecarry Admin Panel
        </p>
      </div>
    </Sidebar>
  );
};

export default Side;