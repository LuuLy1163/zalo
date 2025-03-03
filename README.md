# Cấu Trúc Dự Án React + Vite

Mẫu này cung cấp thiết lập tối thiểu để chạy React với Vite, bao gồm HMR và một số quy tắc ESLint.

## Cấu Trúc Thư Mục

```
src/
├── assets/           # Tài nguyên tĩnh như hình ảnh, font chữ, v.v.
├── components/       # Các component UI có thể tái sử dụng
│   ├── common/      # Component dùng chung cho nhiều tính năng
│   └── layouts/     # Component bố cục (header, footer, v.v.)
├── config/          # File cấu hình và hằng số
├── features/        # Các module theo tính năng
├── hooks/           # Custom React hooks
├── routes/          # Cấu hình và định nghĩa routes
├── pages/          # Các component trang
│   ├── Home/       # Trang chủ
│   ├── About/      # Trang giới thiệu
│   ├── Contact/    # Trang liên hệ
│   └── NotFound/   # Trang 404
├── services/       # Dịch vụ API và xử lý dữ liệu
├── store/          # Quản lý state (Redux/Context)
├── styles/         # Style toàn cục, theme, và CSS modules
└── utils/          # Các hàm tiện ích

public/             # File tĩnh công khai
├── favicon.ico
└── index.html

```

## Chi Tiết Các Thư Mục

- **assets/**: Chứa tất cả các file tĩnh như hình ảnh, font chữ và các file media khác.
- **components/**:
  - **common/**: Các component có thể tái sử dụng như nút, input, card
  - **layouts/**: Các component bố cục như header, footer, sidebar
- **config/**: Cấu hình ứng dụng, biến môi trường và hằng số
- **features/**: Các module theo tính năng chứa mã nguồn theo domain cụ thể
- **hooks/**: Các custom React hooks để chia sẻ logic có state
- **routes/**: Cấu hình và định nghĩa các routes của ứng dụng
- **pages/**: Các component trang chính của ứng dụng
  - **Home/**: Trang chủ và các component liên quan
  - **About/**: Trang giới thiệu và các component liên quan
  - **Contact/**: Trang liên hệ và các component liên quan
  - **NotFound/**: Trang 404 và xử lý lỗi
- **services/**: Tầng dịch vụ API, xử lý dữ liệu và giao tiếp với backend
- **store/**: Thiết lập và logic quản lý state
- **styles/**: Style toàn cục, theme và tiện ích style dùng chung
- **utils/**: Các hàm helper, formatter và code tiện ích

## Thông Tin Plugin

Hiện tại có hai plugin chính thức:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) sử dụng [Babel](https://babeljs.io/) cho Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) sử dụng [SWC](https://swc.rs/) cho Fast Refresh

## Thư Viện Đã Cài Đặt

- **react-router-dom**: Thư viện định tuyến cho React
- **vite**: Build tool và dev server
- **eslint**: Công cụ kiểm tra code

## Hướng Dẫn Phát Triển

1. Giữ các component nhỏ gọn và tập trung vào một nhiệm vụ duy nhất
2. Sử dụng tổ chức theo tính năng để dễ mở rộng
3. Duy trì quy ước đặt tên nhất quán
4. Tuân thủ cấu trúc thư mục đã thiết lập
5. Sử dụng React Router cho việc điều hướng
6. Sử dụng import tuyệt đối khi có thể

## Quy Ước Đặt Tên

1. **Components**: PascalCase (ví dụ: `Header.jsx`, `Button.jsx`)
2. **Hooks**: camelCase với tiền tố "use" (ví dụ: `useAuth.js`, `useTheme.js`)
3. **Utilities**: camelCase (ví dụ: `formatDate.js`, `validation.js`)
4. **Constants**: UPPER_SNAKE_CASE (ví dụ: `API_ENDPOINTS.js`, `ROUTES.js`)

## Cấu Trúc Route

Ứng dụng sử dụng React Router với các route chính:

- `/`: Trang chủ
- `/about`: Trang giới thiệu
- `/contact`: Trang liên hệ
- `*`: Trang 404 (Not Found)

## Môi Trường Phát Triển

1. Clone dự án
2. Cài đặt dependencies: `npm install`
3. Chạy môi trường development: `npm run dev`
4. Build production: `npm run build`
5. Preview production build: `npm run preview`
