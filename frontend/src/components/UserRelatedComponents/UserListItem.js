import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

function UserListItem({ user, handleClick }) {
  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      bg="#e8e8e8"
      _hover={{
        backgroundColor: "#38b2ac",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar mr={2} size="sm" cursor="pointer" src={user.avatar} />
      <Box>
        <Text fontFamily="Lato" fontWeight="bold">
          {user.name}
        </Text>
        <Text fontFamily="Lato" fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
}

export default UserListItem;
