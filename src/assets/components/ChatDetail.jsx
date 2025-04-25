import React, { useState, useEffect, useRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  TextField,
  Tooltip,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import {
  Drawer,
  Divider,
  Button,
  List,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  ListItem,
  Checkbox,
} from "@mui/material";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import { Scrollbar } from "react-scrollbars-custom";
import EmojiPicker from "emoji-picker-react";
import {
  Main,
  DrawerHeader,
  ChatDetailContainer,
  ChatDetailHeader,
  ChatDetailBody,
  ChatDetailInput,
  StyledTextField,
  HoverIconButton,
} from "./StyleChatDetail";

const ChatDetail = ({
  selectedChat,
  onBackToChatList,
  conversationId,
  socket,
}) => {
  const theme = useTheme();
  const chatBodyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [groupMenuAnchorEl, setGroupMenuAnchorEl] = useState(null);
  const isGroupMenuOpen = Boolean(groupMenuAnchorEl);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const drawerWidth = "30vh";
  useEffect(() => {
    // Lấy danh sách bạn bè từ API
    const token = localStorage.getItem("accessToken");

    axios
      .get("http://localhost:5000/api/friend/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAcceptedFriends(response.data.acceptedFriends);
        setPendingFriends(response.data.pendingRequests);
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách bạn bè:", error);
        if (error.response?.status === 401) {
          // navigate('/login');
        }
      });
  }, []); // Chạy khi component mount

  const handleOpenMembersDialog = () => {
    setMembersDialogOpen(true);
    socket.emit("getGroupMembers", { conversationId: selectedChat.id });
  };
  const handleCloseMembersDialog = () => {
    setMembersDialogOpen(false);
  };
  
  useEffect(() => {
    if (!socket) return;
    const handleConversationUpdated = (updated) => {
      if (updated._id === selectedChat.id) {
        // cập nhật selectedChat và messages nếu cần
        // nếu bạn store selectedChat trong state cha, nhớ gọi prop callback
        setMembers(updated.members);
      }
    };
    socket.on("conversation_updated", handleConversationUpdated);
    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [socket, selectedChat]);
  const availableFriendsToAdd = acceptedFriends.filter(
    (friend) => !members.some((m) => {
      const memberId = m.userId?._id || m.userId || m._id;
      return memberId === friend._id;
    })
  );
  
  const toggleInfoDrawer = (open) => () => {
    setInfoDrawerOpen(open);
  };
  const handleCloseAddMember = () => setAddMemberDialogOpen(false);
  const handleMuteChat = () => {
    console.log("Muted chat");
  };

  const handlePinChat = () => {
    console.log("Pinned chat");
  };

  const handleOpenAddMember = () => {
    // reset chọn
    setSelectedUserIds([]);
    setAddMemberDialogOpen(true);
  };
  const [currentUserRole, setCurrentUserRole] = useState(null); // Thêm state để lưu role

  useEffect(() => {
    if (!socket || !selectedChat?.id) return;
  
    // Gửi yêu cầu lấy thông tin thành viên của nhóm
    socket.emit("getGroupMembers", { conversationId: selectedChat.id });
  
    const handleGroupMembers = (data) => {
      // Lưu thông tin thành viên vào state
      setMembers(data.members);
  
      // Tìm role của currentUser trong nhóm
      const currentUserInGroup = data.members.find(
        (member) => member.userId._id === currentUser._id
      );
      setCurrentUserRole(currentUserInGroup?.role); // Lưu role của currentUser
    };
  
    socket.on("group_members", handleGroupMembers);
  
    return () => {
      socket.off("group_members", handleGroupMembers);
    };
  }, [socket, selectedChat, currentUser]);
  

  useEffect(() => {
    if (!socket?.on) return; // Kiểm tra socket có tồn tại và có hàm on

    const handleReceive = (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [conversationId, socket]); // Lắng nghe thay đổi của conversationId và socket

//   useEffect(() => {
//     if (!selectedChat || !currentUser || !socket?.emit || !conversationId)
//       return;

//     socket.emit("join_conversation", {
//       conversationId: conversationId, // Sử dụng conversationId từ props
//       senderId: currentUser._id,
//       // Không cần rereceiveId nữa nếu server chỉ cần conversationId
//     });

//     const handleJoinRoom = (data) => {
//       // Không cần setConversationId ở đây nữa vì nó được truyền từ Chat component

//       fetchMessages(data.conversationId); // Fetch tin nhắn khi đã tham gia room (server có thể emit lại conversationId để xác nhận)
//     };

//     socket.on("joined_room", handleJoinRoom);

//     return () => {
//       socket.off("joined_room", handleJoinRoom);
//     };
//   }, [selectedChat, currentUser, socket, conversationId]);
  useEffect(() => {
    if (!socket || !conversationId) return;
    socket.emit("join_conversation", {
      conversationId,
      senderId: currentUser._id,
    });
  
    // fetch initial messages
    fetchMessages(conversationId);
  
    return () => {
      socket.emit("leave_conversation", { conversationId, userId: currentUser._id });
    };
  }, [socket, conversationId]);  // chỉ hai cái này
  
  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/message/${convId}`
      );
      setMessages(res.data.data);
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err.response || err.message || err);
    }
  };
  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleSendMessage = () => {
    const content = newMessage.trim();
    if (!content || !conversationId || !socket?.emit) return;

    const tempMessage = {
      senderId: currentUser._id,
      content,
      messageType: "text",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    socket.emit("sendMessage", {
      conversationId,
      senderId: currentUser._id,
      content,
      messageType: "text",
    });
  };

  const handleSendFile = (file) => {
    if (!conversationId || !socket?.emit) return;
    const formData = new FormData();
    formData.append("file", file);

    const getMessageTypeFromFile = (file) => {
      const mime = file.type;
      if (mime.startsWith("image/")) return "image";
      if (mime.startsWith("video/")) return "video";
      if (mime.startsWith("audio/")) return "audio";
      return "file";
    };

    const type = getMessageTypeFromFile(file);

    axios
      .post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const fileUrl = res.data.fileUrl;
        if (!fileUrl) return;

        const message = {
          senderId: currentUser._id,
          content: fileUrl,
          messageType: type,
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, message]);

        socket.emit("sendMessage", {
          conversationId,
          senderId: currentUser._id,
          content: fileUrl,
          messageType: type,
        });
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleSendFile(selectedFile);
  };

  const handleKeyPress = (e, newMessage) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage(newMessage);
    }
  };
  const handleRemoveMember = (userId) => {
    if (!selectedChat || !conversationId || !socket) return;
  
    // Gửi yêu cầu xóa thành viên từ nhóm lên BE
    socket.emit("removeMemberConversation", {
      conversationId,
      userId,
    });
  
    // Cập nhật giao diện sau khi xóa
    setMembers(prevMembers => prevMembers.filter(member => member.userId._id !== userId));
  };
  
  const handleOpenMenu = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };
  useEffect(() => {
    if (!socket) return;
  
    socket.on("added_to_group", (updatedConversation) => {
      console.log("Bạn đã được thêm vào nhóm:", updatedConversation);
      // Optionally update UI
    });
  
    return () => {
      socket.off("added_to_group");
    };
  }, [socket]);
  
  const handleRecall = (msgId) => {
    if (!conversationId || !socket?.emit) return;
    socket.emit("recall_message", { messageId: msgId, conversationId });
    setMessages((prev) =>
      prev.map((msg) => (msg._id === msgId ? { ...msg, isRevoked: true } : msg))
    );
    handleCloseMenu();
  };

  const handleDelete = async (msgId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/message/delete-local/${msgId}`
      );
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    handleCloseMenu();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Mỗi khi messages thay đổi, tự động cuộn xuống cuối

  if (!selectedChat) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f0f2f5",
          height: "100%",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Chọn một cuộc trò chuyện để xem chi tiết
        </Typography>
      </Box>
    );
  }

  return (
    <ChatDetailContainer>
      <ChatDetailHeader>
        <HoverIconButton color="inherit" onClick={onBackToChatList}>
          <ArrowBackIcon />
        </HoverIconButton>
        <Avatar src={selectedChat.avatar} sx={{ mr: 2 }} />
        <Typography variant="h6">{selectedChat.name}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <HoverIconButton color="inherit" onClick={toggleInfoDrawer(true)}>
          <MoreVertIcon />
        </HoverIconButton>
      </ChatDetailHeader>

      <ChatDetailBody>
        <Scrollbar style={{ width: "100%", height: "100%" }}>
          {messages.map((msg, index) => {
            const isMine =
              msg.senderId?._id === currentUser._id ||
              msg.senderId === currentUser._id;
            const next = messages[index + 1];
            const isLastOfGroup =
              !next || next.senderId?._id !== msg.senderId?._id;
            const time = moment(msg.createdAt || msg.timestamp).format("HH:mm");
            const renderMessageContent = (msg) => {
              if (msg.isRevoked) {
                return (
                  <Typography
                    variant="body2"
                    fontStyle="italic"
                    color="text.secondary"
                  >
                    Tin nhắn đã thu hồi
                  </Typography>
                );
              }

              let fileName = "";
              if (typeof msg.content === "string") {
                fileName = msg.content.split("/").pop();
              }

              switch (msg.messageType) {
                case "image":
                  return (
                    <a
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={msg.content}
                        alt="image"
                        style={{ maxWidth: "100%", borderRadius: 8 }}
                      />
                    </a>
                  );
                case "video":
                  return (
                    <video controls style={{ maxWidth: "100%" }}>
                      <source src={msg.content} type="video/mp4" />
                      Trình duyệt không hỗ trợ video.
                    </video>
                  );
                case "audio":
                  return (
                    <audio controls>
                      <source src={msg.content} type="audio/mpeg" />
                      Trình duyệt không hỗ trợ audio.
                    </audio>
                  );
                case "file":
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ImageIcon sx={{ fontSize: 24 }} />
                      <Box>
                        <Typography variant="body2" noWrap>
                          {fileName}
                        </Typography>
                        <a
                          href={msg.content}
                          download
                          style={{ fontSize: 12, color: "#1976d2" }}
                        >
                          Tải xuống
                        </a>
                      </Box>
                    </Box>
                  );
                default:
                  return msg.content;
              }
            };

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: isMine ? "row-reverse" : "row",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                {!isMine && (
                  <Avatar
                    src={msg.senderId?.avatarURL}
                    alt={msg.senderId?.username}
                    sx={{ width: 32, height: 32, mt: 0, mr: 1 }}
                  />
                )}
                <Tooltip
                  title={moment(msg.createdAt || msg.timestamp).format(
                    "HH:mm DD/MM"
                  )}
                  arrow
                >
                  <Box
                    sx={{
                      position: "relative",
                      bgcolor: isMine ? "primary.light" : "grey.300",
                      color: "black",
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: "70%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="column" spacing={0.5}>
                      {!isMine && (
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {msg.senderId?.username}
                        </Typography>
                      )}

                      {renderMessageContent(msg)}

                      {isLastOfGroup && (
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.6,
                            alignSelf: isMine ? "flex-end" : "flex-start",
                          }}
                        >
                          {time}
                        </Typography>
                      )}
                    </Stack>

                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, msg)}
                      sx={{
                        position: "absolute",
                        left: isMine ? -30 : "unset",
                        right: !isMine ? -30 : "unset",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1000,
                      }}
                    >
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Tooltip>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Scrollbar>
        <Drawer
          variant="persistent"
          anchor="right"
          open={infoDrawerOpen}
          container={chatBodyRef.current}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              position: "absolute",
              top: 0,
              right: 0,
              width: 300,
              height: "100%",
              boxSizing: "border-box",
              borderLeft: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Back button */}
            <IconButton onClick={toggleInfoDrawer(false)}>
              <ArrowBackIcon />
            </IconButton>

            {/* Chat Info */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
            >
              <Avatar
                src={selectedChat.avatar}
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="h6">{selectedChat.name}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack
              direction="row"
              spacing={4}
              sx={{ justifyContent: "center", mb: 2 }}
            >
              {/* Tắt thông báo */}
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.grey[200],
                  }}
                  onClick={handleMuteChat}
                >
                  <NotificationsOffIcon />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "none",
                    textAlign: "center",
                    color: "grey",
                  }}
                >
                  Tắt thông báo
                </Typography>
              </Stack>

              {/* Ghim hội thoại */}
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.grey[200],
                  }}
                  onClick={handlePinChat}
                >
                  <PushPinIcon />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "none",
                    textAlign: "center",
                    color: "grey",
                  }}
                >
                  Ghim hội thoại
                </Typography>
              </Stack>

              {/* Thêm thành viên */}
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.grey[200],
                  }}
                  onClick={handleOpenAddMember}
                >
                  <GroupAddIcon />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "none",
                    textAlign: "center",
                    color: "grey",
                  }}
                >
                  Thêm thành viên
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Member List */}
            <Button
              fullWidth
              color="primary"
              variant="text"
              onClick={handleOpenMembersDialog}
            >
              Thành viên
            </Button>
            <List dense>
              {selectedChat.members?.map((member, idx) => (
                <ListItem key={idx}>
                  <ListItemAvatar>
                    <Avatar src={member.avatarURL} />
                  </ListItemAvatar>
                  <ListItemText primary={member.username} />
                </ListItem>
              ))}
            </List>

            {/* Leave Group Button */}
            <Button fullWidth color="error" variant="text">
              Rời nhóm
            </Button>
          </Box>
        </Drawer>
        <Dialog
  open={membersDialogOpen}
  onClose={handleCloseMembersDialog}
  fullWidth
  maxWidth="xs"
>
  <DialogTitle>Danh sách thành viên</DialogTitle>
  <DialogContent dividers>
    <List dense>
      {members.map((member, idx) => (
        <ListItem key={idx}>
          <ListItemAvatar>
            <Avatar>
              {member.userId?.avatarURL ? (
                <img
                  src={member.userId.avatarURL}
                  alt={member.userId.username}
                />
              ) : (
                member.userId.username?.[0] // In chữ cái đầu tiên nếu không có avatar
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={member.userId.username}
            secondary={`${member.role} • Joined on ${moment(
              member.joinedAt
            ).format("DD/MM/YYYY")}`}
          />
          {/* Chỉ hiển thị nút xóa cho thành viên không phải là admin */}
          {currentUserRole === "admin" && member.userId._id !== currentUser._id && (
             <Button
             color="error"
             onClick={() => handleRemoveMember(member.userId._id)}
           >
             Xóa
           </Button>
          )}
        </ListItem>
      ))}
    </List>
  </DialogContent>
  <DialogActions>
    <MuiButton onClick={handleCloseMembersDialog}>Đóng</MuiButton>
  </DialogActions>
</Dialog>


        <Dialog
  open={addMemberDialogOpen}
  onClose={handleCloseAddMember}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Chọn thành viên mới</DialogTitle>
  <DialogContent dividers>
    <List>
    {availableFriendsToAdd.map((friend) => (
  <ListItemButton
    key={friend._id}
    onClick={() => {
      setSelectedUserIds((prev) =>
        prev.includes(friend._id)
          ? prev.filter((id) => id !== friend._id)
          : [...prev, friend._id]
      );
    }}
    sx={{ display: "flex", alignItems: "center", px: 2 }}
  >
    <ListItemAvatar>
      <Avatar src={friend.avatarURL}>{friend.username[0]}</Avatar>
    </ListItemAvatar>
    <ListItemText primary={friend.username} sx={{ flex: 1 }} />
    <Checkbox
      edge="end"
      checked={selectedUserIds.includes(friend._id)}
      disableRipple
      tabIndex={-1}
      onChange={() => {
        setSelectedUserIds((prev) =>
          prev.includes(friend._id)
            ? prev.filter((id) => id !== friend._id)
            : [...prev, friend._id]
        );
      }}
    />
  </ListItemButton>
))}

    </List>
  </DialogContent>
  <DialogActions>
    <MuiButton onClick={handleCloseAddMember}>Hủy</MuiButton>
    <MuiButton
      variant="contained"
      disabled={selectedUserIds.length === 0}
      onClick={() => {
        // Gửi danh sách ID về đúng format BE yêu cầu
        socket.emit("addMemberConversation", {
          conversationId: selectedChat.id,
          members: selectedUserIds, // <-- mảng các userId
        });
        handleCloseAddMember();
      }}
    >
      Thêm
    </MuiButton>
  </DialogActions>
</Dialog>

      </ChatDetailBody>

      <ChatDetailInput>
        <HoverIconButton color="inherit">
          <label htmlFor="file-upload">
            <AttachFileIcon />
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </HoverIconButton>

        <StyledTextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          placeholder="Nhập tin nhắn..."
          size="small"
          multiline
          minRows={1}
        />

        <HoverIconButton color="inherit" onClick={handleSendMessage}>
          <SendIcon />
        </HoverIconButton>

        <HoverIconButton
          color="inherit"
          onClick={() => setPickerOpen(!pickerOpen)}
        >
          <EmojiEmotionsIcon />
        </HoverIconButton>
      </ChatDetailInput>

      {pickerOpen && (
        <Box
          sx={{
            position: "absolute",
            bottom: 90,
            right: 30,
            zIndex: 10,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ position: "absolute", left: "-80px", zIndex: 1000 }}
      >
        <MenuItem onClick={() => handleCopy(selectedMessage?.content)}>
          Sao chép
        </MenuItem>
        <MenuItem onClick={() => handleRecall(selectedMessage?._id)}>
          Thu hồi
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedMessage?._id)}>
          Xóa
        </MenuItem>
      </Menu>
    </ChatDetailContainer>
  );
};

export default ChatDetail;
