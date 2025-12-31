import React from 'react';
import './Message.css';

const getColorForPseudo = (pseudo) => {
  const colors = [
    "#1976d2", "#f57c00", "#388e3c", "#7b1fa2", "#c2185b",
    "#00796b", "#ffa000", "#512da8", "#d32f2f", "#303f9f"
  ];
  let hash = 0;
  for (let i = 0; i < pseudo.length; i++) {
    hash = pseudo.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Message = ({ message, pseudo, emoji, isUser }) => {
  const userMessage = isUser(pseudo);

  const style = {
    backgroundColor: userMessage ? getColorForPseudo(pseudo) : "#e0e0e0",
    color: userMessage ? "#fff" : "#333",
    alignSelf: userMessage ? "flex-start" : "flex-end"
  };

  const className = userMessage
    ? "message-bubble pulse"
    : "message-bubble not-user pulse";

  return (
    <div className={className} style={style}>
      <strong>{pseudo}</strong>: {message} {emoji && <span className="emoji">{emoji}</span>}
    </div>
  );
};

export default Message;
