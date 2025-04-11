import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const navigate = useNavigate();

  const handleSendCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      showAlert("Vui lòng nhập email hợp lệ", "warning");
      return;
    }

    try {
      const resCheck = await fetch("http://localhost:5000/api/auth/checkEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!resCheck.ok) {
        const text = await resCheck.text();
        console.error("Email không tồn tại:", text);
        showAlert("Email chưa được đăng kí với tài khoản nào!", "error");
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok || (!data?.code && !data?.data?.code)) {
        showAlert("Không thể gửi mã xác minh!", "error");
        return;
      }

      setVerifyCode(data.code || data.data.code);
      showAlert("Mã xác minh đã được gửi đến email của bạn!", "success");
      setStep(2);
    } catch (err) {
      console.error("Lỗi gửi mã xác minh:", err);
      showAlert("Đã xảy ra lỗi. Vui lòng thử lại sau.", "error");
    }
  };

  const handleVerifyCode = () => {
    if (!verifyCode) {
      showAlert("Chưa có mã xác minh. Quay lại bước 1 để lấy mã.", "warning");
      setStep(1);
      return;
    }

    if (inputCode.trim() !== verifyCode.toString()) {
      showAlert("Mã xác minh không đúng!", "error");
      return;
    }

    showAlert("Xác minh thành công!", "success");
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert("Vui lòng nhập đầy đủ mật khẩu", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("Mật khẩu không khớp", "error");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
      showAlert("Mật khẩu phải ít nhất 6 ký tự, gồm cả chữ và số", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgotPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.message || "Lỗi khi đổi mật khẩu", "error");
        return;
      }

      showAlert("Đổi mật khẩu thành công!", "success");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Lỗi reset mật khẩu:", err);
      showAlert("Không thể đổi mật khẩu. Vui lòng thử lại sau.", "error");
    }
  };

  return (
    <div className="container-register">
      <div className="form-register">
        <span className="title">Zalo</span>

        {step === 1 && (
          <>
            <Typography variant="h6">Quên mật khẩu</Typography>
            <Typography variant="body2" mb={1} color="black">
              Nhập email để nhận mã xác minh
            </Typography>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSendCode}
              sx={{ marginTop: "2vh", height: "5vh" }}
            >
              Gửi mã xác minh
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="body2" mb={2} color="black">
              Nhập mã xác minh đã được gửi qua email
            </Typography>
            <TextField
              fullWidth
              label="Mã xác minh"
              variant="outlined"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              margin="normal"
            />
            <Button fullWidth variant="contained" onClick={handleVerifyCode}>
              Xác nhận
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="h6">Đặt lại mật khẩu</Typography>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
            <Button fullWidth variant="contained" onClick={handleResetPassword}>
              Đổi mật khẩu
            </Button>
          </>
        )}
      </div>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ForgotPassword;
