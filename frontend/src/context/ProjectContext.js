//////////////////////////////////////////////////////////////////////////////////////////
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  listProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../services/mockApi";

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects on mount
    const fetchProjects = async () => {
      const data = await listProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const addNewProject = async (project) => {
    const newProject = await addProject(project);
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateExistingProject = async (id, patch) => {
    const updatedProject = await updateProject(id, patch);
    setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));
    return updatedProject;
  };

  const deleteExistingProject = async (id) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject: addNewProject,
        updateProject: updateExistingProject,
        deleteProject: deleteExistingProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
