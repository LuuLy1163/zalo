import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

function NewMessageNotifier({ socket, currentChatId }) {
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.conversationId !== currentChatId) {
        setMessageInfo({
          content: message.text,
          sender: message.senderName || "Người dùng",
        });
        setOpen(true);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, currentChatId]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
        💬 {messageInfo?.sender}: {messageInfo?.content}
      </Alert>
    </Snackbar>
  );
}

export default NewMessageNotifier;
