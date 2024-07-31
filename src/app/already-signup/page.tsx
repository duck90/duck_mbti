"use client";
import { Stack, Typography } from "@mui/material";

function AlreadySignUp() {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ height: "calc(100vh - 100px)" }}
    >
      <Typography variant="h5">이미 가입된 이메일 입니다.</Typography>
    </Stack>
  );
}

export default AlreadySignUp;
