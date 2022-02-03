import React, { useState } from "react";
import {
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { BiSearchAlt } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import Chatty from "../../assets/images/chatty.png";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserRelatedComponents/UserListItem";
import { Spinner } from "@chakra-ui/react";
import { getSender } from "../../config/chatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  console.log("notifications", notifications);

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isCloseable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isCloseable: true,
        position: "bottom",
      });
      setLoadingChat(false);
    }
  };

  return (
    <Box
      d="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <BiSearchAlt size="25" />
          <Text d={{ base: "none", md: "flex" }} px="4">
            Search User
          </Text>
        </Button>
      </Tooltip>
      <img src={Chatty} alt="" style={{ height: "40px" }} />

      <div style={{ display: "flex", alignItems: "center" }}>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count={notifications.length}
              effect={Effect.SCALE}
            />
            <BsFillBellFill size="20" />
          </MenuButton>
          <MenuList pl={2}>
            {!notifications.length
              ? "No new messages"
              : notifications.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(
                        notifications.filter((n) => n !== notif)
                      );
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
          </MenuList>
        </Menu>
        <Menu style={{ marginLeft: "20px" }}>
          <MenuButton as={Button} rightIcon={<FaChevronDown size={10} />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.avatar}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Search Users to Chat
          </DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleClick={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default SideDrawer;
