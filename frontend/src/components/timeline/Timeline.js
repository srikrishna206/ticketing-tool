// for UI/UX  ok

import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import { useProjects } from "../../context/ProjectContext";

const Timeline = () => {
  const ganttContainer = useRef(null);
  const { projects, addProject } = useProjects();
  const [newProjectText, setNewProjectText] = useState("");
  const [hover, setHover] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.config.readonly = false;
    gantt.config.drag_move = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_links = true;
    gantt.config.auto_scheduling = true;
    gantt.config.show_errors = false;
    gantt.config.highlight_critical_path = true;

    // Responsive Gantt configuration
    gantt.config.scale_unit = windowWidth > 768 ? "month" : "week";
    gantt.config.date_scale = windowWidth > 768 ? "%F, %Y" : "%M %d";
    gantt.config.subscales =
      windowWidth > 768
        ? [{ unit: "week", step: 1, date: "%j, %D" }]
        : [{ unit: "day", step: 1, date: "%d" }];

    gantt.init(ganttContainer.current);

    gantt.clearAll();
    gantt.parse({
      data: projects,
      links: [
        { id: 1, source: 1, target: 2, type: "0" },
        { id: 2, source: 2, target: 3, type: "0" },
        { id: 3, source: 3, target: 4, type: "0" },
        { id: 4, source: 4, target: 5, type: "0" },
      ],
    });

    // Re-render Gantt on window resize
    gantt.render();
  }, [projects, windowWidth]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width <= 768);
      setIsSmallMobile(width <= 480);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreateProject = () => {
    if (!newProjectText.trim()) return;
    const newProject = {
      id: Date.now(),
      text: newProjectText,
      start_date: "2025-12-10 00:00",
      duration: 10,
      progress: 0,
    };
    addProject(newProject);
    setNewProjectText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateProject();
    }
  };

  // Responsive styles
  const containerStyle = {
    margin: isMobile ? "15px 10px" : "30px auto",
    maxWidth: "1200px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    overflow: "hidden",
    background: "#D0F0F4",
    fontFamily: "Segoe UI, sans-serif",
    transform: "perspective(1000px)",
    transition: "transform 0.3s ease-in-out",
  };

  const headerStyle = {
    padding: isMobile ? "18px 15px" : "25px",
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    color: "#fff",
    fontSize: isMobile ? "22px" : "28px",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "0.8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
  };

  const ganttStyle = {
    height: isMobile ? (isSmallMobile ? "350px" : "400px") : "600px",
    width: "100%",
    borderTop: "1px solid #ccc",
    overflow: "auto",
  };

  const inputContainerStyle = {
    padding: isMobile ? "15px" : "20px",
    display: "flex",
    gap: "12px",
    flexDirection: isSmallMobile ? "column" : "row",
    alignItems: isSmallMobile ? "stretch" : "center",
  };

  const inputStyle = {
    flex: "1",
    padding: isMobile ? "10px 14px" : "12px 16px",
    fontSize: isMobile ? "14px" : "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    outline: "none",
    minWidth: "0",
  };

  const buttonStyle = {
    padding: isMobile ? "10px 16px" : "12px 20px",
    fontSize: isMobile ? "14px" : "16px",
    borderRadius: "8px",
    background: "#8c6deaff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    whiteSpace: "nowrap",
    minWidth: isSmallMobile ? "100%" : "auto",
  };

  const buttonHoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        {isMobile ? "📅 Timeline" : "📅 Project Timeline"}
      </div>

      <div style={inputContainerStyle}>
        <input
          type="text"
          value={newProjectText}
          onChange={(e) => setNewProjectText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isMobile ? "New project..." : "Enter new project name..."
          }
          style={inputStyle}
          aria-label="New project name"
        />
        <button
          onClick={handleCreateProject}
          style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label="Add new project"
        >
          {isMobile ? "➕ Add" : "➕ Add Project"}
        </button>
      </div>

      <div
        ref={ganttContainer}
        style={ganttStyle}
        className="gantt-container"
      ></div>
    </div>
  );
};

export default Timeline;
