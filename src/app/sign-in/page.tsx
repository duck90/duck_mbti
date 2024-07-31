"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack, Button, TextField } from "@mui/material";

function SignInPage() {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email");

  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ width: "100%", height: "100%" }}
    >
      <Stack
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <TextField
          variant="outlined"
          label="email"
          value={formValue.email}
          onChange={(e) =>
            setFormValue({ ...formValue, email: e.target.value })
          }
          sx={{ width: 300, m: 1 }}
          disabled={!!defaultEmail}
        />
        <TextField
          type="password"
          variant="outlined"
          label="password"
          value={formValue.password}
          onChange={(e) =>
            setFormValue({ ...formValue, password: e.target.value })
          }
          sx={{ width: 300, m: 1 }}
        />

        <Button
          variant="contained"
          sx={{ width: 300, m: 1 }}
          onClick={() => console.log(formValue)}
        >
          Login
        </Button>
      </Stack>
    </Stack>
  );
}

export default SignInPage;
