import { useState } from "react";
import { auth } from "../../assets/components/Firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
        'expired-callback': () => {
          alert("Mã xác thực hết hạn, vui lòng thử lại!");
        }
      });
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  const handleSendOTP = async () => {
    if (!/^\d{9,11}$/.test(phone)) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    setupRecaptcha();
    const fullPhone = "+84" + phone.slice(1);
    try {
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      alert("Mã OTP đã được gửi!");
      setStep(2);
    } catch (err) {
      console.error("Lỗi gửi OTP:", err);
      alert("Không gửi được OTP, vui lòng thử lại.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Vui lòng nhập mã OTP");
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      alert("Xác thực OTP thành công!");
      setStep(3);
    } catch (err) {
      console.error("Lỗi xác thực OTP:", err);
      alert("Mã OTP không đúng hoặc đã hết hạn.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
      alert("Mật khẩu phải ít nhất 6 ký tự, có cả chữ và số");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Lỗi khi đổi mật khẩu");
        return;
      }

      alert("Đổi mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      console.error("Lỗi reset:", err);
      alert("Không thể đổi mật khẩu, thử lại sau.");
    }
  };

  return (
    <div className="container-register">
      <div className="form-register">
        <span className="title">Zalo</span>
        <div id="recaptcha-container" style={{ display: "none" }}></div>

        {step === 1 && (
          <>
            <span className="subtitle">Quên mật khẩu</span>
            <p className="content">Nhập số điện thoại của bạn để nhận mã OTP</p>
            <div className="form">
              <div className="form-content">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  className="input-phone"
                />
              </div>
              <button className="button-send-otp" onClick={handleSendOTP}>
                Gửi OTP
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <span className="subtitle">Nhập mã OTP</span>
            <div className="form">
              <div className="form-content">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Nhập mã OTP"
                  className="input-phone"
                />
              </div>
              <button className="button-send-otp" onClick={handleVerifyOTP}>
                Xác nhận
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <span className="subtitle">Đặt lại mật khẩu</span>
            <div className="form">
              <div className="form-content">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mật khẩu mới"
                  className="input-phone"
                />
              </div>
              <div className="form-content">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  className="input-phone"
                />
              </div>
              <button className="button-send-otp" onClick={handleResetPassword}>
                Đổi mật khẩu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
