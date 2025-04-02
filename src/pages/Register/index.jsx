import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Register.css";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendOTP = () => {
    if (phone.trim() === "") {
      alert("Vui lòng nhập số điện thoại");
      return;
    }
    console.log("Gửi mã OTP đến số:", phone);
    setStep(2);
  };

  const handleVerifyOTP = () => {
    if (otp.trim() === "") {
      alert("Vui lòng nhập mã OTP");
      return;
    }
    console.log("Xác thực OTP:", otp);
    setStep(3); 
  };

  const handleRegister = () => {
    if (password.trim() === "" || confirmPassword.trim() === "") {
      alert("Vui lòng nhập mật khẩu và xác nhận mật khẩu");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    console.log("Đăng ký thành công với mật khẩu:", password);
    navigate("/dashboard");
  };

  return (
    <div className="container-register">
      <div className="form-register">
        <span className="title">Zalo</span>
        {step === 1 ? (
          <>
            <span className="subtitle">Tạo tài khoản mới</span>
            <p className="content">
              Để tạo tài khoản mới, vui lòng nhập số điện thoại chưa từng đăng ký hoặc đăng nhập tài khoản Zalo.
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
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button className="button-send-otp" onClick={handleSendOTP} disabled={!phone}>
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
              <button className="button-send-otp" onClick={handleVerifyOTP} disabled={!otp}>
                Xác nhận
              </button>
              <p className="resend-otp" onClick={handleSendOTP}>Gửi lại mã OTP</p>
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
