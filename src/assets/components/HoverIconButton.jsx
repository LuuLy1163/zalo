// src/assets/components/common/HoverIconButton.jsx
import React from "react";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HoverIconButton = (props) => {
  return <StyledIconButton {...props} />;
};

export default HoverIconButton;
