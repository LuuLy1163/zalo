import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Liên Hệ</h1>
      <nav className="mb-4">
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-blue-500 hover:text-blue-700">
              Về Chúng Tôi
            </Link>
          </li>
        </ul>
      </nav>
      <div className="prose">
        <p>Liên hệ với chúng tôi qua:</p>
        <ul className="list-disc ml-6">
          <li>Email: contact@example.com</li>
          <li>Điện thoại: (84) 123-456-789</li>
          <li>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</li>
        </ul>
      </div>
    </div>
  );
};

export default Contact; 