import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { BsEye } from "react-icons/bs";

function ProfileModal({ children, user: userInfo }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: loggedUser } = ChatState();
  const user = userInfo ? userInfo : loggedUser;

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<BsEye />} onClick={onOpen} />
      )}

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Lato"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Avatar
                size="2xl"
                src={user.avatar}
                shadow="true"
                as={Box}
                boxShadow="md"
                bgColor="black"
              />
              <Text fontSize="20px" fontFamily="Lato" fontWeight="bold" mt="5">
                {user.email}
              </Text>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
