import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material"; // 💡 Thêm import này
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Register.css";
import avt from "../../assets/images/User-avatar.svg.png";
import { auth } from "../../assets/components/Firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [phoneExists, setPhoneExists] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ open: false, severity: "", message: "" }); // 🔥

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

  const checkPhoneExists = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/check-phone?phone=${phone}`);
      const data = await res.json();
      setPhoneExists(data.exists);
      return data.exists;
    } catch (err) {
      console.error("Lỗi khi kiểm tra số điện thoại:", err);
      setPhoneExists(true);
      return true;
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          showAlert("warning", "Mã xác thực hết hạn, vui lòng thử lại!");
        }
      });
      window.recaptchaVerifier.render().then(widgetId => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  const handleSendOTP = async () => {
    if (phone.trim() === "") return showAlert("warning", "Vui lòng nhập số điện thoại");
    if (!/^\d{9,11}$/.test(phone)) return showAlert("error", "Số điện thoại không hợp lệ");

    const exists = await checkPhoneExists();
    if (exists) return showAlert("error", "Số điện thoại đã tồn tại, vui lòng dùng số khác.");

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const fullPhone = "+84" + phone.slice(1);

    try {
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(confirmation);
      showAlert("success", "Mã OTP đã được gửi!");
      setStep(2);
    } catch (error) {
      console.error("Lỗi gửi OTP:", error);
      showAlert("error", "Gửi OTP thất bại. Vui lòng kiểm tra lại số điện thoại.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) return showAlert("warning", "Vui lòng nhập mã OTP");

    try {
      await confirmationResult.confirm(otp);
      showAlert("success", "Xác thực OTP thành công!");
      setStep(3);
    } catch (err) {
      console.error("Lỗi xác thực OTP:", err);
      showAlert("error", "Mã OTP không đúng hoặc đã hết hạn.");
    }
  };

  const handleRegister = async () => {
    if (!password || !confirmPassword) return showAlert("warning", "Vui lòng nhập mật khẩu và xác nhận mật khẩu");

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password))
      return showAlert("error", "Mật khẩu phải ít nhất 6 ký tự, có cả chữ và số");

    if (password !== confirmPassword) return showAlert("error", "Mật khẩu không khớp");

    try {
      const avatarResponse = await fetch(avt);
      const blob = await avatarResponse.blob();
      const avatarFile = new File([blob], "default-avatar.png", { type: blob.type });

      const formData = new FormData();
      formData.append("username", phone);
      formData.append("phoneNumber", phone);
      formData.append("password", password);
      formData.append("email", `${phone}@example.com`);
      formData.append("dateOfBirth", new Date().toISOString());
      formData.append("gender", "other");
      formData.append("avatarURL", avatarFile);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.clone().json();
      } catch (e) {
        const text = await res.text();
        console.error("Phản hồi không hợp lệ:", text);
        showAlert("error", "Lỗi server. Vui lòng thử lại sau.");
        return;
      }

      if (!res.ok) {
        showAlert("error", data?.error || data?.message || "Đăng ký thất bại");
        return;
      }

      showAlert("success", "Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      showAlert("error", "Đã xảy ra lỗi khi đăng ký.");
    }
  };

  return (
    <div className="container-register">
      <div className="form-register">
        <span className="title">Zalo</span>
        <div id="recaptcha-container"></div>

        {alertMsg.open && (
          <Alert variant="filled" severity={alertMsg.severity} style={{ marginBottom: 16 }}>
            {alertMsg.message}
          </Alert>
        )}

        {step === 1 ? (
          <>
            <span className="subtitle">Tạo tài khoản mới</span>
            <p className="content">
              Vui lòng nhập số điện thoại chưa từng đăng ký hoặc đăng nhập tài khoản Zalo.
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
                  onBlur={checkPhoneExists}
                />
                {phoneExists && <p className="error-text">Số điện thoại đã tồn tại</p>}
              </div>
              <button
                className="button-send-otp"
                onClick={handleSendOTP}
                disabled={!phone}
              >
                Tiếp tục
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <span className="subtitle">Xác nhận mã OTP</span>
            <p className="content">
              Nhập mã OTP đã gửi đến số điện thoại <b>{phone}</b>
            </p>
            <div className="form">
              <div className="form-content">
                <input
                  value={otp}
                  type="text"
                  className="input-phone"
                  placeholder="Nhập mã OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button
                className="button-send-otp"
                onClick={handleVerifyOTP}
                disabled={!otp}
              >
                Xác nhận
              </button>
              <p className="resend-otp" onClick={handleSendOTP}>
                Gửi lại mã OTP
              </p>
            </div>
          </>
        ) : (
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
                  className={
                    showConfirmPassword ? "fa fa-eye-slash" : "fa fa-eye"
                  }
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
