import React from "react";
import { useTemplates } from "../TemplateContext";

const MessageCard = ({ template }) => {
  const { updateTemplate, deleteTemplate } = useTemplates();

  const handleEdit = async () => {
    const updatedContent = prompt("Edit Template Content", template.content);
    if (updatedContent) {
      try {
        await updateTemplate(template._id, {
          ...template,
          content: updatedContent,
        });
      } catch (error) {
        console.error("Error updating template:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(template._id);
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  return (
    <div className="message-item">
      <div className="message-header">
        <div className="message-info">
          <h3 className="message-title">{template.name}</h3>
          <p className="message-context">{template.context}</p>
        </div>
        <div className="message-actions">
          <button className="action-button" onClick={handleEdit}>
            Edit
          </button>
          <button className="action-button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <p className="message-content">{template.content}</p>
    </div>
  );
};

export default MessageCard;
