import { createContext, useState, useEffect } from "react";
import { getLocalstorage, setLocalstorage } from "../utils/localStorage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setuserData] = useState(null);

  useEffect(() => {
    setLocalstorage(); // initialize localStorage if empty
    const { employees, admin } = getLocalstorage();
    setuserData({ employees, admin });
  }, []);

  // Function to update employees state and localStorage
  const updateEmployees = (updatedEmployees) => {
    setuserData((prev) => ({
      ...prev,
      employees: updatedEmployees,
    }));
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  // Function to add a task to an employee
  const addTaskToEmployee = (employeeFirstName, newTask) => {
    if (!userData) return; // avoid errors if userData not loaded yet

    const updatedEmployees = userData.employees.map((emp) => {
      if (emp.firstName === employeeFirstName) {
        // update tasks array
        const newTasks = [...emp.tasks, newTask];
        // update task counts
        const newTaskNumber = {
          ...emp.taskNumber,
          newTask: emp.taskNumber.newTask + 1,
          active: emp.taskNumber.active + (newTask.active ? 1 : 0),
          // You can update other counts if needed here too
        };

        return {
          ...emp,
          tasks: newTasks,
          taskNumber: newTaskNumber,
        };
      }
      return emp;
    });

    updateEmployees(updatedEmployees);
  };

  return (
    <AuthContext.Provider value={{ ...userData, addTaskToEmployee }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
