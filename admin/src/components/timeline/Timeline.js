












// for updated code ok 


import React, { useState } from "react";

const initialTasks = [
  {
    name: "Setup repo",
    start: "2025-09-22",
    duration: "1 Hr",
    barWidth: "15%",
    barColor: "#f6b6b7",
  },
  {
    name: "Setup DB",
    start: "2025-09-22",
    duration: "24 Hr",
    barWidth: "50%",
    barColor: "#c6f6fa",
  },
];

const Timeline = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  // Helper to format current date and time as "YYYY-MM-DD HH:mm:ss"
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          name: newTask,
          start: getCurrentDateTime(),
          duration: "1 Hr",
          barWidth: "15%",
          barColor: "#f6b6b7",
        },
      ]);
      setNewTask("");
    }
  };

  return (
    <div
      style={{
        background: "#e5f6fb",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#a076f2",
          color: "#fff",
          padding: "24px 0 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          fontWeight: 600,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <span style={{ marginRight: "12px", fontSize: "30px" }}>🗓️</span>
        Project Timeline
      </div>
      {/* Input Section */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
          background: "#fff",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <input
          style={{
            flex: 1,
            fontSize: "22px",
            padding: "9px 13px",
            borderRadius: "7px",
            border: "1.5px solid #cacaca",
            outline: "none",
            color: "#aaa",
          }}
          type="text"
          placeholder="New Task Name"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          style={{
            fontSize: "16px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "7px",
            padding: "9px 21px",
            cursor: "pointer",
            boxShadow: "0 1px 5px rgba(0,0,0,0.10)",
            fontWeight: 500,
          }}
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      {/* Timeline Table */}
      <div
        style={{
          margin: "22px",
          background: "#fff",
          borderRadius: "9px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "18px" }}>
          <thead>
            <tr>
              <th
                style={{
                  background: "#fafafc",
                  fontWeight: 600,
                  padding: "11px 10px",
                  borderBottom: "2px solid #ececec",
                  textAlign: "left",
                }}
              >
                Task name
              </th>
              <th
                style={{
                  background: "#fafafc",
                  fontWeight: 600,
                  padding: "11px 10px",
                  borderBottom: "2px solid #ececec",
                  textAlign: "left",
                }}
              >
                Start time
              </th>
              <th
                style={{
                  background: "#fafafc",
                  fontWeight: 600,
                  padding: "11px 10px",
                  borderBottom: "2px solid #ececec",
                  textAlign: "left",
                }}
              >
                Duration
              </th>
              <th
                style={{
                  background: "#fafafc",
                  fontWeight: 600,
                  padding: "11px 10px",
                  borderBottom: "2px solid #ececec",
                  textAlign: "left",
                }}
                colSpan={5}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  <span>September 2025</span>
                  <span style={{ marginLeft: "16px" }}>October 2025</span>
                </div>
              </th>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td
                style={{
                  background: "#f3f6fb",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "10px 10px",
                  borderBottom: "2px solid #ececec",
                  color: "#707793",
                }}
              >
                1 Hr
              </td>
              <td
                style={{
                  background: "#f3f6fb",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "10px 10px",
                  borderBottom: "2px solid #ececec",
                  color: "#707793",
                }}
              >
                12 Hr
              </td>
              <td
                style={{
                  background: "#f3f6fb",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "10px 10px",
                  borderBottom: "2px solid #ececec",
                  color: "#707793",
                }}
              >
                24 Hrs
              </td>
              <td
                style={{
                  background: "#f3f6fb",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "10px 10px",
                  borderBottom: "2px solid #ececec",
                  color: "#707793",
                }}
              >
                2 Days
              </td>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={idx}>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #f0f0f0",
                    verticalAlign: "middle",
                    fontSize: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      background: "#f6f7fa",
                      border: "1.5px solid #bbb",
                      borderRadius: "16px",
                      padding: "2px 16px",
                      fontWeight: 500,
                      marginRight: "7px",
                      marginBottom: "4px",
                      display: "inline-block",
                    }}
                  >
                    {task.name}
                  </span>
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #f0f0f0",
                    verticalAlign: "middle",
                    fontSize: "16px",
                  }}
                >
                  {task.start}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #f0f0f0",
                    verticalAlign: "middle",
                    fontSize: "16px",
                  }}
                >
                  {task.duration}
                </td>
                <td
                  style={{
                    position: "relative",
                    minWidth: "500px",
                    height: "60px",
                    background: "#f9fbff",
                  }}
                  colSpan={4}
                >
                  <div
                    style={{
                      background: task.barColor,
                      borderRadius: "8px",
                      height: "23px",
                      width: task.barWidth,
                      position: "absolute",
                      left: "3%",
                      top: "15px",
                      zIndex: 2,
                      boxShadow: "0 2px 7px rgba(0,0,0,0.06)",
                    }}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timeline;