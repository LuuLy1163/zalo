import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-600 mb-4">
        Không Tìm Thấy Trang
      </h2>
      <p className="text-gray-500 mb-8">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Về Trang Chủ
      </Link>
    </div>
  );
};

export default NotFound; 