import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:9000/chat", {
        message: input,
      });
      setMessages([
        ...newMessages,
        { text: response.data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌿 Plant Adoption Guidance Chatbot</h2>
      <div style={styles.chatbox}>
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{
              ...styles.message,
              ...(msg.sender === "user"
                ? styles.userMessage
                : styles.botMessage),
            }}
          >
            {msg.text}
          </p>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={styles.inputBox}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

// 🌿 Green-Themed Styles
const styles = {
  container: {
    width: "50%",
    margin: "0 auto",      // Centers horizontally
    marginTop: "150px",     // 250px top margin
    textAlign: "center",
    padding: "20px",
    border: "1px solid #8BC34A",
    borderRadius: "12px",
    background: "#F1F8E9",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "600px",
  },
  title: {
    color: "#2E7D32",
    fontSize: "20px",
    fontWeight: "bold",
  },
  chatbox: {
    minHeight: "300px",
    border: "1px solid #C5E1A5",
    padding: "12px",
    marginBottom: "12px",
    background: "#FFF",
    overflowY: "auto",
    maxHeight: "400px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    scrollbarWidth: "thin",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "70%",
    wordWrap: "break-word",
    display: "inline-block",
    fontSize: "14px",
    lineHeight: "1.4",
    transition: "all 0.3s ease",
  },
  userMessage: {
    background: "#4CAF50",
    color: "white",
    textAlign: "right",
    alignSelf: "flex-end",
  },
  botMessage: {
    background: "#A5D6A7",
    color: "black",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  inputBox: {
    flex: 1,
    padding: "12px",
    border: "1px solid #8BC34A",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    transition: "border 0.3s ease",
  },
  sendButton: {
    background: "#388E3C",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    fontSize: "14px",
  },
};

export default Chatbot;
