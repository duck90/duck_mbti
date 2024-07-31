import { useState } from "react";
import { useCookies } from "react-cookie";
import { SHA256 } from "crypto-js";
import { cloneDeep } from "lodash";
import { Box, Button, TextField, Typography } from "@mui/material";

import { OAUTH } from "@/enum";
import { loginUser } from "@/services/user";

const SOCIAL = [
  { key: OAUTH.NAVER, label: "네이버" },
  { key: OAUTH.KAKAO, label: "카카오" },
];

interface Props {
  close: Function;
}

const LoginModal = ({ close }: Props) => {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [warning, setWarning] = useState({
    email: "",
    password: "",
  });
  const [_, setCookie] = useCookies();

  const onClickLoginButton = () => {
    const warningText = cloneDeep(warning);
    let isValidation = true;

    if (!formValue.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      isValidation = false;
      warningText.email = "Check your email";
    } else {
      warningText.email = "";
    }

    if (formValue.password.length < 5 || formValue.password.length > 20) {
      isValidation = false;
      warningText.password = "Check password length";
    } else {
      warningText.password = "";
    }

    setWarning(warningText);

    if (isValidation) {
      login();
    }
  };

  const login = async () => {
    try {
      const result = await loginUser({
        email: formValue.email,
        password: SHA256(formValue.password).toString(),
      });
      setCookie("dbti_access_token", result.access_token);
      setCookie("dbti_refresh_token", result.refresh_token);
      close();
    } catch (e: any) {
      window.alert(e.response.data.error);
    }
  };

  return (
    <Box sx={styles.modalStyle}>
      <Box>
        <TextField
          variant="outlined"
          label="email"
          value={formValue.email}
          onChange={(e) =>
            setFormValue({ ...formValue, email: e.target.value })
          }
          sx={{ width: 300, m: 1 }}
        />
        {warning.email && (
          <Typography variant="subtitle2" sx={{ color: "red", ml: 2 }}>
            {warning.email}
          </Typography>
        )}
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
        {warning.password && (
          <Typography variant="subtitle2" sx={{ color: "red", ml: 2 }}>
            {warning.password}
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{ width: 300, m: 1, mt: 3 }}
          onClick={onClickLoginButton}
        >
          Login
        </Button>
      </Box>

      {SOCIAL.map((item) => (
        // <Button key={item.key} onClick={() => signIn(item.key)}>
        <Button
          key={item.key}
          onClick={() => {
            window.open(
              `/sign-in/${item.key}`,
              "_blank",
              "location=yes,height=570,width=520,scrollbars=yes,status=yes"
            );
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
};

export default LoginModal;

const styles = {
  modalStyle: {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
};
