import React from "react";
import { useForm } from "react-hook-form";
import { useTemplates } from "../TemplateContext";

const MessageForm = () => {
  const { addTemplate } = useTemplates();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await addTemplate(data);
      alert("Template created successfully!");
      reset();
    } catch (error) {
      console.error(error);
      alert("Error creating template.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="Name"
        {...register("name", {
          required: "Name is required",
          minLength: {
            value: 3,
            message: "Name must be at least 3 characters",
          },
        })}
      />
      {errors.name && <p>{errors.name.message}</p>}
      <input
        placeholder="Context"
        {...register("context", {
          required: "Context is required",
          toLowerCase: true,
          minLength: {
            value: 5,
            message: "Context must be at least 5 characters",
          },
        })}
      />
      {errors.context && <p>{errors.context.message}</p>}
      <textarea
        placeholder="Content"
        {...register("content", {
          required: "Content is required",
          minLength: {
            value: 10,
            message: "Content must be at least 10 characters",
          },
        })}
      />
      {errors.content && <p>{errors.content.message}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create Template"}
      </button>
    </form>
  );
};

export default MessageForm;
