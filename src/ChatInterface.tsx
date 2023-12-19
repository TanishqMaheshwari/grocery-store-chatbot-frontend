import React, { useState, useRef, useEffect } from "react";
import "./ChatInterface.css"; // Make sure this is correctly pointing to your CSS file

interface Message {
  author: "user" | "bot";
  text: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Create a ref for the textarea
  const messagesEndRef = useRef<HTMLDivElement>(null); // Create a ref for the messages container

  useEffect(() => {
    // Adjust the height whenever messages change
    const current = textareaRef.current;
    if (current) {
      current.style.height = "inherit"; // Reset height to recalculate
      current.style.height = `${current.scrollHeight}px`; // Set new height based on content
    }
  }, [messages]); // Depend on messages, so it updates on send

  const sendMessage = () => {
    if (inputText.trim() !== "") {
      const newMessage: Message = { author: "user", text: inputText };
      setMessages([...messages, newMessage]);

      // Dummy bot response
      const botResponse: Message = { author: "bot", text: "Chatbot message" };
      setMessages((currentMessages) => [...currentMessages, botResponse]);

      setInputText("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Prevents sending message when Shift+Enter is pressed
      e.preventDefault(); // Prevents adding a new line in textarea
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    const current = textareaRef.current;
    if (current) {
      current.style.height = 'inherit'; // Reset height to recalculate
      current.style.height = `${e.target.scrollHeight}px`; // Set new height based on content
    }
  };

  // ensure that the chat interface always scrolls to the bottom when a new message is added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const adjustTextareaHeight = (text: string) => {
    const textareaLineHeight = 24; // Adjust to match your CSS line-height
    const minRows = 1;

    // Calculate the number of lines
    const lines = text.split("\n").length + (text.endsWith("\n") ? 1 : 0);
    const rows = Math.min(Math.max(lines, minRows));

    return rows * textareaLineHeight;
  };

  return (
    <div className="chat-interface">
      <header>Grocery Store Chatbot</header>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.author}`}>
            {message.text}
          </div>
        ))}
        {/*
          This div is used to scroll to the bottom of the chat interface
          whenever a new message is added
        */}
        <div ref={messagesEndRef} />
      </div>
      <form className="input-area" onSubmit={sendMessage}>
        <textarea
          value={inputText}
          ref={textareaRef}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message..."
          style={{ height: "auto", overflowY: "hidden" }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
