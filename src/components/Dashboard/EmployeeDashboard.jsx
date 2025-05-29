import { useState, useEffect } from "react";
import TaskList from "../TaskList/TaskList";
import Header from "../other/Header";
import TaskListNumbers from "../other/TaskListNumbers";

const EmployeeDashboard = ({ data: initialData, changeUser, loggedInUserData }) => {
  // Step 1: Manage data as state to reflect changes
  const [data, setData] = useState(initialData);

  // If initialData changes (e.g., new login), sync state
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Step 2: Handler to update task status
  const updateTaskStatus = (taskTitle, newStatus) => {
    const updatedTasks = data.tasks.map((task) => {
      if (task.title === taskTitle) {
        // Reset all status flags first
        const resetTask = {
          ...task,
          newTask: false,
          active: false,
          completed: false,
          failed: false,
        };
        // Set the new status flag
        resetTask[newStatus] = true;
        return resetTask;
      }
      return task;
    });

    // Recalculate task counts
    const taskNumber = { newTask: 0, active: 0, completed: 0, failed: 0 };
    updatedTasks.forEach((task) => {
      if (task.newTask) taskNumber.newTask++;
      if (task.active) taskNumber.active++;
      if (task.completed) taskNumber.completed++;
      if (task.failed) taskNumber.failed++;
    });

    // Update data state
    const updatedData = { ...data, tasks: updatedTasks, taskNumber };

    setData(updatedData);

    // Step 4: Update localStorage too (if needed)
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const updatedEmployees = employees.map((emp) =>
      emp.email === data.email ? updatedData : emp
    );
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  return (
    <div className="p-10 bg-[#1C1C1C] h-screen">
      <Header
        changeUser={changeUser}
        data={data}
        loggedInUserData={loggedInUserData}
      />
      <TaskListNumbers data={data} />
      {/* Step 3: Pass update handler to TaskList */}
      <TaskList data={data} onUpdateTaskStatus={updateTaskStatus} />
    </div>
  );
};

export default EmployeeDashboard;
