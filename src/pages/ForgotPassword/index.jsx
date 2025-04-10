import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Bước 1: Gửi mã xác minh
  const handleSendCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      alert("Vui lòng nhập email hợp lệ");
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
        alert("Email không tồn tại!");
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data?.code && !data?.data?.code) {
        alert("Không thể gửi mã xác minh!");
        return;
      }

      setVerifyCode(data.code || data.data.code);
      alert("Mã xác minh đã được gửi đến email của bạn!");
      setStep(2);
    } catch (err) {
      console.error("Lỗi gửi mã xác minh:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  // Bước 2: Xác minh mã
  const handleVerifyCode = () => {
    if (!verifyCode) {
      alert("Chưa có mã xác minh. Quay lại bước 1 để lấy mã.");
      setStep(1);
      return;
    }

    if (inputCode.trim() !== verifyCode.toString()) {
      alert("Mã xác minh không đúng!");
      return;
    }

    alert("Xác minh thành công!");
    setStep(3);
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
      alert("Mật khẩu phải ít nhất 6 ký tự, gồm cả chữ và số");
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
        alert(data.message || "Lỗi khi đổi mật khẩu");
        return;
      }

      alert("Đổi mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      console.error("Lỗi reset mật khẩu:", err);
      alert("Không thể đổi mật khẩu. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container-register">
      <div className="form-register">
        <span className="title">Zalo</span>

        {step === 1 && (
          <>
            <span className="subtitle">Quên mật khẩu</span>
            <p className="content">Nhập email để nhận mã xác minh</p>
            <div className="form">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-phone"
              />
              <button className="button-send-otp" onClick={handleSendCode}>
                Gửi mã xác minh
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <span className="subtitle">Xác minh danh tính</span>
            <p className="content">Nhập mã xác minh đã được gửi qua email</p>
            <div className="form">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Mã xác minh"
                className="input-phone"
              />
              <button className="button-send-otp" onClick={handleVerifyCode}>
                Xác nhận
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <span className="subtitle">Đặt lại mật khẩu</span>
            <div className="form">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                className="input-phone"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                className="input-phone"
              />
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
