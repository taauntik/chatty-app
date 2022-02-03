import { Box } from "@chakra-ui/react";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";

function UserBadgeItem({ handleDelete, user }) {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      d="flex"
      alignItems="center"
      variant="solid"
      fontSize={12}
      backgroundColor="lightgray"
      color="black"
      cursor="pointer"
      onClick={handleDelete}
    >
      {user.name} <IoCloseSharp size="12" />
    </Box>
  );
}

export default UserBadgeItem;
