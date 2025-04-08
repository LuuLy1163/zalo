import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./SignLogin.css";

const SignLogin = () => {
  const [isLoginByPhone, setIsLoginByPhone] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClickLogin();
    }
  };

  const handleClickLogin = () => {
    console.log("Đăng nhập với:", phone, password);
  };

  return (
    <div className="container-login">
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
              VỚI SỐ ĐIỆN THOẠI
            </span>
          </div>

          {isLoginByPhone ? (
            <div className="login-by-phone">
              <div className="form-content">
                <i className="fa-solid fa-mobile-screen-button icon"></i>
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
                  navigate("/forgot-password", {
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
                  alt=""
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
