import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const TemplateContext = createContext();

export function TemplateProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/templates");
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch templates");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTemplate = useCallback(async (templateData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/templates",
        templateData
      );
      setTemplates((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message || "Failed to add template");
      console.error("Add error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/templates/${id}`);
      setTemplates((prev) => prev.filter((template) => template._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Delete error:", err);
      return { success: false, error: err.message };
    }
  }, []);

  const updateTemplate = useCallback(async (id, updateData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/templates/${id}`,
        updateData
      );
      setTemplates((prev) =>
        prev.map((template) => (template._id === id ? response.data : template))
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Update error:", err);
      return { success: false, error: err.message };
    }
  }, []);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        loading,
        error,
        fetchTemplates,
        addTemplate,
        deleteTemplate,
        updateTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplates must be used within a TemplateProvider");
  }
  return context;
};
