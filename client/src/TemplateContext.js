import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";

const TemplateContext = createContext();

const API_URL =
  process.env.NODE_ENV === "production"
    ? window.location.hostname
    : "http://localhost:5000";

export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/templates`);
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  }, []);

  const addTemplate = useCallback(async (templateData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/templates`,
        templateData
      );
      setTemplates((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateTemplate = useCallback(async (id, updates) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/templates/${id}`,
        updates
      );
      setTemplates((prev) =>
        prev.map((t) => (t._id === id ? response.data : t))
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteTemplate = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/api/templates/${id}`);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      throw error;
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
        updateTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplates = () => useContext(TemplateContext);
