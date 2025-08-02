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
  Timeline
} from "@mui/icons-material"; // Icons
import { Activity, ListOrderedIcon } from "lucide-react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom"; // For navigation
const Side = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    localStorage.removeItem("name"); // Remove the token from local storage
    localStorage.removeItem("id"); // Remove the token from local storage
    localStorage.removeItem("role"); // Remove the token from local storage
    // console.log("Token removed, logging out...");
    navigate("/"); // Navigate to the logout route
  };
  return (
  <Sidebar
    rootStyles={{
      height: "100vh",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.08)",
      background: "linear-gradient(180deg, #e9fdf5 0%, #d4ffe5 100%)",
      position: "relative",
    }}
  >
    {/* Sidebar Header */}
    <div
      style={{
        padding: "28px 20px 20px 20px",
        textAlign: "center",
        borderBottom: "1px solid #c4e3d8",
        background: "linear-gradient(90deg, #34d399 0%, #10b981 100%)",
        color: "#fff",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: "900", letterSpacing: ".05em" }}>
        Carryluxe
      </h2>
      <p style={{ margin: 0, color: "#d1fae5", fontSize: "1rem", fontWeight: 500 }}>
        Admin sidebar
      </p>
      <p style={{ margin: 0, color: "#b6f7d5", fontSize: "0.9rem", fontWeight: 400 }}>
        Welcome, Admin!
      </p>
    </div>

    {/* Sidebar Menu */}
    <Menu
      menuItemStyles={{
        button: {
          borderRadius: "14px",
          margin: "4px 0",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#bbf7d0",
            color: "#059669",
            transform: "translateX(3px) scale(1.04)",
            boxShadow: "0 2px 6px 0 #34d39930",
          },
          transition: "all 0.18s",
        },
      }}
    >
      <MenuItem icon={<Home style={{ color: "#059669" }} />} component={<Link to="/" />}>
        Home
      </MenuItem>
      <MenuItem icon={<Dashboard style={{ color: "#059669" }} />} component={<Link to="/admindashboard" />}>
        Dashboard
      </MenuItem>

      {/* Charts Submenu */}
      <SubMenu label="Charts" icon={<BarChart style={{ color: "#059669" }} />}>
        <MenuItem icon={<PieChart style={{ color: "#059669" }} />} component={<Link to="/admin/piechart" />}>
          Pie Chart
        </MenuItem>
        <MenuItem icon={<Timeline style={{ color: "#059669" }} />} component={<Link to="/admin/barchart" />}>
          Bar Chart
        </MenuItem>
      </SubMenu>

      {/* Add Items */}
      <MenuItem icon={<Medication style={{ color: "#059669" }} />} component={<Link to="/additems" />}>
        Add Items
      </MenuItem>
      {/* Search Items */}
      <MenuItem icon={<Search style={{ color: "#059669" }} />} component={<Link to="/getitems" />}>
        Search Items
      </MenuItem>
      <MenuItem icon={<ListOrderedIcon style={{ color: "#059669" }} />} component={<Link to="/allorder" />}>
        Orders
      </MenuItem>

      {/* Divider */}
      <div
        style={{
          margin: "18px 0 12px 0",
          borderBottom: "1px solid #b5e2cb",
        }}
      />

      {/* Settings */}
      <MenuItem icon={<Activity style={{ color: "#059669" }} />} component={<Link to="/activitylogs" />}>
        Activity Logs
      </MenuItem>
      <MenuItem icon={<AccountBoxOutlined style={{ color: "#059669" }} />} component={<Link to="/myprofile" />}>
        Profile
      </MenuItem>
      {/* Messages */}
      <MenuItem icon={<People style={{ color: "#059669" }} />} component={<Link to="/admin/contactus" />}>
        Messages
      </MenuItem>
      {/* Logout */}
      <MenuItem
        icon={<ExitToApp style={{ color: "#ef4444" }} />}
        component={<Link to="/" />}
        style={{ color: "#ef4444", fontWeight: 600 }}
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
        borderTop: "1px solid #b5e2cb",
        background: "linear-gradient(90deg, #34d399 0%, #10b981 100%)",
        color: "#e0fcef",
        position: "absolute",
        bottom: 0,
        width: "100%",
        fontSize: "0.93rem",
        fontWeight: 500,
        letterSpacing: ".01em"
      }}
    >
      © 2025 Carryluxe Admin Panel
    </div>
  </Sidebar>
);
}
export default Side;