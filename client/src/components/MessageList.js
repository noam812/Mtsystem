import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageCard from "./MessageCard";

const MessageList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/templates");
        setTemplates(response.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading templates...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="tags">
          <span className="tag">All</span>
          <span className="tag">Recent</span>
          <span className="tag">Favorites</span>
        </div>
      </div>
      {templates.map((template) => (
        <MessageCard
          key={template._id}
          template={template}
          setTemplates={setTemplates}
        />
      ))}
    </div>
  );
};


export default MessageList;
