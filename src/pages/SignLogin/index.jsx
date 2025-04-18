import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Alert, Snackbar } from "@mui/material";
import "./SignLogin.css";

const SignLogin = () => {
  const [isLoginByPhone, setIsLoginByPhone] = useState(true);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "info" });
  const [openAlert, setOpenAlert] = useState(false);

  const navigate = useNavigate();

  const showAlert = (message, severity = "info") => {
    setAlert({ message, severity });
    setOpenAlert(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClickLogin();
    }
  };

  const handleClickLogin = async () => {
    if (!loginInput || !password) {
      showAlert("Vui lòng nhập đầy đủ thông tin", "warning");
      return;
    }

    const isEmail = loginInput.includes("@");

    let bodyData;
    if (isEmail) {
      bodyData = { email: loginInput, password };
    } else {
      let phone = loginInput.trim().replace(/\s/g, "");
      bodyData = { phoneNumber: phone, password };
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        showAlert(data?.error || data?.message || "Đăng nhập thất bại", "error");
        return;
      }

      // ✅ Lưu token và user vào localStorage
      const { accessToken, user } = data.data;
      localStorage.setItem("accessToken", accessToken); // Lưu accessToken
      localStorage.setItem("user", JSON.stringify(user));  // Lưu thông tin user

      showAlert("Đăng nhập thành công!", "success");

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      showAlert("Lỗi kết nối server. Vui lòng thử lại", "error");
    }
  };

  return (
    <div className="container-login">
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      <div className="form-login">
        <span className="title">Zalo</span>
        <span className="content">
          Đăng nhập tài khoản Zalo <br />
          để kết nối với ứng dụng Zalo Web
        </span>
        <div className="form">
          <div className="choose-login">
            <span
              onClick={() => setIsLoginByPhone(false)}
              style={{ color: !isLoginByPhone ? "#056BFF" : "" }}
            >
              VỚI MÃ QR
            </span>
            <span
              onClick={() => setIsLoginByPhone(true)}
              style={{ color: isLoginByPhone ? "#056BFF" : "" }}
            >
              VỚI EMAIL / SỐ ĐIỆN THOẠI
            </span>
          </div>

          {isLoginByPhone ? (
            <div className="login-by-phone">
              <div className="form-content">
                <i className="fa-solid fa-user icon"></i>
                <input
                  value={loginInput}
                  type="text"
                  className="input-phone"
                  placeholder="Email hoặc Số điện thoại"
                  onChange={(e) => setLoginInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      document.querySelector(".input-password").focus();
                    }
                  }}
                />
              </div>
              <div className="form-content">
                <i className="fa-solid fa-lock icon"></i>
                <input
                  value={password}
                  type="password"
                  className="input-password"
                  placeholder="Mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <button className="button-login" onClick={handleClickLogin}>
                Đăng nhập với mật khẩu
              </button>
              <button
                className="button-register"
                onClick={() =>
                  navigate("/register", {
                    state: { urlBackend: "your_backend_url" },
                  })
                }
              >
                Tạo tài khoản
              </button>
              <span
                onClick={() =>
                  navigate("/forgotPassword", {
                    state: { urlBackend: "your_backend_url" },
                  })
                }
                className="forget-password"
              >
                Quên mật khẩu?
              </span>
            </div>
          ) : (
            <div className="login-by-qrcode">
              <div className="qrcode">
                <img
                  src="your_qr_code_src"
                  alt="QR Code"
                  style={{ marginTop: -20, width: "250px", height: "250px" }}
                />
                <div
                  style={{ fontSize: 14, color: "#4692dd", fontWeight: "bold" }}
                  className="textUnder"
                >
                  Chỉ dùng để đăng nhập
                </div>
                <div
                  style={{
                    marginTop: 23,
                    color: "#8b9196",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                  className="textUnder"
                >
                  Zalo trên máy tính
                </div>
              </div>
              <span>Sử dụng ứng dụng Zalo để quét mã QR</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignLogin;
