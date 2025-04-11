import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Register.css";
import avt from "../../assets/images/User-avatar.svg.png";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [phoneExists, setPhoneExists] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ open: false, severity: "", message: "" });
  const [otpToken, setOtpToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (alertMsg.open) {
      const timer = setTimeout(() => setAlertMsg({ ...alertMsg, open: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const showAlert = (severity, message) => {
    setAlertMsg({ open: true, severity, message });
  };

  const checkPhoneAndEmailExists = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/checkPhoneAndEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, email }),
      });
  
      const data = await res.json();
  
      if (res.status === 409) {
        // 409 thường trả về thông tin cụ thể về xung đột
        if (data.phoneExists) {
          setPhoneExists(true);
          showAlert("error", "Số điện thoại đã tồn tại.");
        }
  
        if (data.emailExists) {
          showAlert("error", "Email đã tồn tại.");
        }
  
        return true; // Có xung đột
      }
  
      if (!res.ok) {
        showAlert("error", data?.message || "Lỗi kiểm tra thông tin.");
        return true;
      }
  
      setPhoneExists(false);
      return false;
    } catch (err) {
      console.error("Lỗi khi kiểm tra tồn tại:", err);
      showAlert("error", "Không thể kiểm tra thông tin. Vui lòng thử lại.");
      return true;
    }
  };
  
  

  const handleSendOTP = async () => {
    // Kiểm tra định dạng input
    if (phone.trim() === "") return showAlert("warning", "Vui lòng nhập số điện thoại");
    if (!/^\d{9,11}$/.test(phone)) return showAlert("error", "Số điện thoại không hợp lệ");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return showAlert("error", "Email không hợp lệ");
  
    // Kiểm tra tồn tại email/số điện thoại
    console.log("⏳ Đang kiểm tra số điện thoại và email...");
    const exists = await checkPhoneAndEmailExists();
  
    if (exists) {
      showAlert("error", "Email hoặc số điện thoại đac được đăng ký. Vui lòng thử lại.");
      return; // Nếu đã tồn tại thì dừng lại ở đây
    }
  
    try {
      setOtpToken(null); // Reset OTP cũ
  
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        console.log("❌ Lỗi gửi OTP:", data);
        return showAlert("error", data?.message || "Gửi mã xác thực thất bại");
      }
  
      showAlert("success", "Mã xác thực đã được gửi tới email!");
      console.log("✅ OTP token từ BE:", data?.data?.code);
      setOtpToken(data?.data?.code);
      setStep(2);
    } catch (error) {
      console.error("❌ Lỗi gửi mã xác thực:", error);
      showAlert("error", "Gửi mã xác thực thất bại. Vui lòng thử lại.");
    }
  };
  

  const handleVerifyOTP = async () => {
    if (!otp.trim()) return showAlert("warning", "Vui lòng nhập mã xác thực");
    if (!otpToken) return showAlert("error", "Không có mã xác thực. Vui lòng gửi lại.");

    if (otp.trim() !== otpToken.toString()) {
      return showAlert("error", "Mã xác thực không đúng");
    }

    showAlert("success", "Xác thực thành công!");
    setStep(3);
  };

  const handleRegister = async () => {
    if (!password || !confirmPassword)
      return showAlert("warning", "Vui lòng nhập mật khẩu và xác nhận mật khẩu");
  
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password))
      return showAlert("error", "Mật khẩu phải ít nhất 6 ký tự, có cả chữ và số");
  
    if (password !== confirmPassword) return showAlert("error", "Mật khẩu không khớp");
  
    try {
      const payload = {
        username: phone,
        phoneNumber: phone,
        password,
        email,
        dateOfBirth: new Date().toISOString(),
        gender: "other",
        avatarURL: "https://i.pinimg.com/736x/dc/e3/cb/dce3cb7b2daeb86ca5bd921ae06f3b2f.jpg",
      };
  
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (!res.ok) return showAlert("error", data?.message || "Đăng ký thất bại");
  
      showAlert("success", "Đăng ký thành công!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      showAlert("error", "Đã xảy ra lỗi khi đăng ký.");
    }
  };
  

  return (
    <div className="container-register">
      <div className="form-register">
        <span className="title">Zalo</span>

        {alertMsg.open && (
          <Alert variant="filled" severity={alertMsg.severity} style={{ marginBottom: 16 }}>
            {alertMsg.message}
          </Alert>
        )}

        {step === 1 && (
          <>
            <span className="subtitle">Tạo tài khoản mới</span>
            <p className="content">
              Vui lòng nhập số điện thoại và email chưa từng đăng ký tài khoản Zalo.
            </p>
            <div className="form">
              <div className="form-content">
                <select name="phone" className="select-national">
                  <option value={84}>+84</option>
                  <option value={44}>+44</option>
                  <option value={852}>+852</option>
                </select>
                <input
                  value={phone}
                  type="text"
                  className="input-phone"
                  placeholder="Số điện thoại"
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneExists(false);
                  }}
                  onBlur={checkPhoneAndEmailExists}
                />
              </div>
              <div className="form-content">
                <input
                  value={email}
                  type="email"
                  className="input-phone"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {phoneExists && <p className="error-text">Số điện thoại đã tồn tại</p>}
              <button className="button-send-otp" onClick={handleSendOTP} disabled={!phone || !email}>
                Tiếp tục
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <span className="subtitle">Xác nhận mã xác thực</span>
            <p className="content">Nhập mã xác thực đã gửi đến email <b>{email}</b></p>
            <div className="form">
              <div className="form-content">
                <input
                  value={otp}
                  type="text"
                  className="input-phone"
                  placeholder="Nhập mã xác thực"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button className="button-send-otp" onClick={handleVerifyOTP} disabled={!otp}>
                Xác nhận
              </button>
              <p
                className="resend-otp"
                onClick={() => {
                  setOtpToken(null);
                  handleSendOTP();
                }}
              >
                Gửi lại mã
              </p>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <span className="subtitle">Nhập mật khẩu</span>
            <div className="form">
              <div className="form-content">
                <input
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="input-phone"
                  placeholder="Nhập mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              <div className="form-content">
                <input
                  value={confirmPassword}
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-phone"
                  placeholder="Nhập lại mật khẩu"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i
                  className={showConfirmPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></i>
              </div>
              <button className="button-send-otp" onClick={handleRegister}>
                Đăng ký
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
