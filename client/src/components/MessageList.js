import React, { useEffect } from "react";
import MessageCard from "./MessageCard";
import { useTemplates } from "../TemplateContext";

const MessageList = () => {
  const { templates, loading, error, fetchTemplates } = useTemplates();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  if (loading) return <div className="loading-state">Loading templates...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

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
        <MessageCard key={template._id} template={template} />
      ))}
    </div>
  );
};

export default MessageList;
