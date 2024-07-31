"use client";
import { Stack, Typography, Button } from "@mui/material";

function SignUpComplete() {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ height: "calc(100vh - 100px)" }}
    >
      <Typography variant="h5">가입되었습니다.</Typography>
      <Button
        variant="contained"
        onClick={() => window.close()}
        sx={{ mt: 10 }}
      >
        닫기
      </Button>
    </Stack>
  );
}

export default SignUpComplete;
