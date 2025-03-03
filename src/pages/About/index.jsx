import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Về Chúng Tôi</h1>
      <nav className="mb-4">
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-blue-500 hover:text-blue-700">
              Liên Hệ
            </Link>
          </li>
        </ul>
      </nav>
      <div className="prose">
        <p>Đây là trang giới thiệu về chúng tôi.</p>
        <p>Chúng tôi là một đội ngũ phát triển web chuyên nghiệp.</p>
      </div>
    </div>
  );
};

export default About; 