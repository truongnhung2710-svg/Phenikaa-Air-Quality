# Phenikaa Air Quality - Web

Ứng dụng Web Dashboard quản trị hệ thống giám sát chất lượng không khí (khí CO) thời gian thực tại Đại học Phenikaa. 
## Tính năng chi tiết 
- **Authentication** (Xác thực): Đăng nhập, đăng ký tài khoản cán bộ quản lý, khôi phục mật khẩu thông qua cơ chế Token mã hóa JWT kết hợp lưu trữ phiên làm việc an toàn tại localStorage.
- **Dashboard** trực quan theo thời gian thực:Tích hợp 4 thẻ thống kê nhanh: Trạng thái kết nối hệ thống, chỉ số CO hiện tại, cảnh báo ngưỡng an toàn, tổng số trạm đang hoạt động trực tuyến.Hệ thống đồ thị đường (Line Chart) biểu diễn dữ liệu CO realtime đồng thời của 2 trạm đo độc lập, tự động kích hoạt tiến trình nạp lại dữ liệu.
- **Quản lý trạm đo**: Bảng dữ liệu tương tác hiển thị danh sách trạm và nồng độ CO realtime
- **Xem lại Lịch sử dữ liệu**: Biểu diễn bảng số liệu lịch sử, tự động tính toán nhanh các chỉ số cốt lõi: Min, Average, Max trong khoảng thời gian tùy chọn. Hỗ trợ Xuất báo cáo định dạng file CSV trực tiếp về máy tính.
- **Hồ sơ cá nhân**: Thay đổi thông tin hiển thị của quản trị viên, cập nhật mật khẩu mới bảo mật và đăng xuất an toàn khỏi hệ thống.

## Yêu cầu Hệ thống
- **Node.js** >= 18.x
- **Trình duyệt Web hiện đại**: Google Chrome, Microsoft Edge, Mozilla Firefox hoặc Safari hỗ trợ chuẩn hiển thị ES6+.
- **Máy chủ Backend Node.js** đang khởi chạy ổn định tại cổng mạng chỉ định

## Hướng dẫn Cài đặt
Di chuyển từ thư mục gốc vào phân hệ Web và cài đặt toàn bộ package:
```Bash cd frontend/web
npm install
```

## Cấu hình API Kết nối Backend (REACT_APP_API_URL)
Trước khi tiến hành kích hoạt giao diện, bạn cần liên kết ứng dụng Web tới máy chủ API thông qua file cấu hình môi trường .env.Tạo file .env nằm ngay trong thư mục /frontend/web:
```bash 
REACT_APP_API_URL=http://localhost:5001/api
```

## Chạy Dự án ở Môi trường Phát triển (Development)
Kích hoạt công cụ build nội bộ của React để lập trình:
```Bash npm start```

Sau khi quá trình biên dịch hoàn tất, hệ thống sẽ tự động khởi tạo và mở trình duyệt tại địa chỉ: http://localhost:3000

### Cấu trúc chi tiết

```text
├── public/ # File tĩnh và index.html gốc của React
└── src/
    ├── components/ # Các phần tử giao diện dùng chung (Button, Loading, Modal)
    │   └── Sidebar/ # Thành phần Sidebar
    ├── context/ # Quản lý trạng thái toàn cục (AuthContext.js quản lý phiên đăng nhập)
    ├── hooks/ # Các custom hooks tối ưu logic (useRealtimeData.js)
    ├── routes/ # Quản lý phân luồng tuyến đường bảo mật (Private & Public Routes)
    ├── screens/ # Các màn hình chức năng chính của Web UI
    │   ├── auth/ # Nhóm màn hình Login, Register, ForgotPassword
    │   ├── DashboardScreen.js # Màn hình bảng điều khiển chính
    │   ├── ManagementScreen.js # Bảng dữ liệu danh sách quản lý trạm đo
    │   ├── HistoryScreen.js # Giao diện tra cứu lịch sử đo đạc, tính Min/Avg/Max và xuất CSV
    │   └── ProfileScreen.js # Màn hình quản lý tài khoản và đổi thông tin cá nhân
    ├── services/ # Cấu hình Axios Client kết nối tập trung đến Backend API
    └── theme/ # Định nghĩa mã màu CSS biến toàn cục

## Đóng gói & Triển khai Production (Build & Deploy)
Khi dự án hoàn thiện và nghiệm thu, tiến hành biên dịch mã nguồn thành các file tĩnh tối ưu hóa dung lượng:Bashnpm run build
Toàn bộ mã nguồn sản phẩm đầu ra sẽ được nén gọn trong thư mục build/.


