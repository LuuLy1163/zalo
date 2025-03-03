import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Trang Chủ</h1>
      <nav className="mb-4">
        <ul className="flex gap-4">
          <li>
            <Link to="/about" className="text-blue-500 hover:text-blue-700">
              Về Chúng Tôi
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
        <p>Chào mừng đến với trang web của chúng tôi!</p>
      </div>
    </div>
  );
};

export default Home; 