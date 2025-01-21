import React from "react";
import axios from "axios";

const MessageCard = ({ template, setTemplates }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/templates/${template._id}`);
      setTemplates((prevTemplates) =>
        prevTemplates.filter((t) => t._id !== template._id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    const updatedTemplate = prompt("Edit Template Content", template.content);
    if (updatedTemplate) {
      try {
        const response = await axios.put(`/api/templates/${template._id}`, {
          ...template,
          content: updatedTemplate,
        });
        setTemplates((prevTemplates) =>
          prevTemplates.map((t) => (t._id === template._id ? response.data : t))
        );
      } catch (error) {
        console.error("Error updating template:", error);
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
