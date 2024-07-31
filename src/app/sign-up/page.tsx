"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack, Button, TextField, Box, Typography } from "@mui/material";
import { SHA256 } from "crypto-js";

import { createUser } from "@/services/user";

function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [warning, setWarning] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const defaultEmail = searchParams.get("email");

  const inputs = [
    { key: "email", type: "text", label: "email", disable: !!defaultEmail },
    { key: "password", type: "password", label: "password", disable: false },
    {
      key: "confirmPassword",
      type: "password",
      label: "confirm password",
      disable: false,
    },
    { key: "nickname", type: "text", label: "nickname", disable: false },
  ];

  const checkValidation = () => {
    let isValidation = true;

    if (!formValue.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      isValidation = false;
      warning.email = "Check your email";
    } else {
      warning.email = "";
    }

    if (formValue.password.length < 5 || formValue.password.length > 20) {
      isValidation = false;
      warning.password = "Check password length";
    } else {
      warning.password = "";
    }

    if (formValue.password !== formValue.confirmPassword) {
      isValidation = false;
      warning.confirmPassword = "Password and confirm password is different";
    } else {
      warning.confirmPassword = "";
    }

    Object.keys(formValue).forEach((key) => {
      const value = (formValue as any)[key];
      if (!value) {
        isValidation = false;
        (warning as any)[key] = "Please enter";
      }
    });

    setWarning({ ...warning });

    if (isValidation) {
      signUp();
    }
  };

  const signUp = async () => {
    try {
      await createUser({
        email: formValue.email,
        password: SHA256(formValue.password).toString(),
        nickname: formValue.nickname,
      });
      router.replace("/sign-up/complete");
    } catch (e) {
      console.log(e);
      window.alert("error");
    }
  };

  useEffect(() => {
    if (!!defaultEmail) {
      setFormValue({ ...formValue, email: defaultEmail });
    }
  }, []);

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
        {inputs.map((item) => {
          return (
            <Box key={item.key} sx={{ m: 1 }}>
              <TextField
                type={item.type}
                variant="outlined"
                label={item.label}
                value={(formValue as any)[item.key]}
                onChange={(e) =>
                  setFormValue({ ...formValue, [item.key]: e.target.value })
                }
                sx={{ width: 300 }}
                disabled={item.disable}
              />
              {(warning as any)[item.key] && (
                <Typography
                  variant="subtitle2"
                  sx={{ color: "red", mt: 0.5, ml: 0.5 }}
                >
                  {(warning as any)[item.key]}
                </Typography>
              )}
            </Box>
          );
        })}

        <Button
          variant="contained"
          sx={{ width: 300, m: 1 }}
          onClick={checkValidation}
        >
          Sign up
        </Button>
      </Stack>
    </Stack>
  );
}

export default SignUpPage;
