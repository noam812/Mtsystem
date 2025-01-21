import React from "react";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";
import { TemplateProvider } from "./TemplateContext";

function App() {
  return (
    <TemplateProvider>
      <div className="App">
        <div className="sidebar">
          <h1>Message Template Manager</h1>
        </div>
        <div className="main-content">
          <MessageForm />
          <MessageList />
        </div>
      </div>
    </TemplateProvider>
  );
}

export default App;
