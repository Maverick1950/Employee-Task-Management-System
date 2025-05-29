import { useContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import { AuthContext } from "./context/AuthProvider";

const App = () => {
  const [userRole, setUserRole] = useState(null); // just role string: "admin" or "employee"
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const authData = useContext(AuthContext);

  // On mount or when authData changes, restore user from localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        const userData = JSON.parse(loggedInUser);
        setUserRole(userData.role);
        setLoggedInUserData(userData.data || null);
      } catch (err) {
        console.error("Failed to parse loggedInUser from localStorage", err);
      }
    }
  }, [authData]); // keep this, but it will re-run if authData changes

  const handleLogin = (email, password) => {
    if (email === "admin@me.com" && password === "123") {
      setUserRole("admin");
      setLoggedInUserData(null);
      localStorage.setItem("loggedInUser", JSON.stringify({ role: "admin" }));
    } else if (authData && authData.employees) {
      // Wait for authData and employees to exist
      const employee = authData.employees.find(
        (e) => e.email === email && e.password === password
      );
      if (employee) {
        setUserRole("employee");
        setLoggedInUserData(employee);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ role: "employee", data: employee })
        );
      } else {
        alert("Invalid Credentials");
      }
    } else {
      alert("Invalid Credentials");
    }
  };

  // If authData is not loaded yet, render loading or nothing to avoid crash
  if (!authData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!userRole ? (
        <Login handleLogin={handleLogin} />
      ) : userRole === "admin" ? (
        <AdminDashboard text="admin" changeUser={setUserRole} />
      ) : userRole === "employee" ? (
        <EmployeeDashboard
          loggedInUserData={loggedInUserData}
          changeUser={setUserRole}
          data={loggedInUserData}
        />
      ) : null}
    </>
  );
};

export default App;
