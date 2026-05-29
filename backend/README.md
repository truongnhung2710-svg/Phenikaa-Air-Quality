# Phenikaa Air Quality - Backend

Mã nguồn tầng Server của hệ thống giám sát dữ liệu chất lượng không khí Phenikaa. Đóng vai trò tiếp nhận, xử lý dữ liệu trạm đo cảm biến gửi lên, phân loại lưu trữ vào hệ cơ sở dữ liệu kép và cung cấp RESTful API bảo mật cho cả Web và Mobile clients.

## Tính năng Core Backend
- **Xác thực & Phân quyền (Authentication & Session)**: Tích hợp Passport.js xử lý cơ chế đăng nhập, đăng ký, mã hóa mật khẩu an toàn và bảo mật phiên làm việc thông qua JWT/Session.

- **Tiếp nhận Dữ liệu Realtime**: Endpoint mở tiếp nhận gói tin từ Gateway LoRaWAN.

- **Xử lý Dữ liệu Chuỗi thời gian (Time-series)**: Kết nối trực tiếp driver InfluxDB để ghi dữ liệu đo đạc liên tục với mốc thời gian chính xác cao, hỗ trợ truy vấn báo cáo min/max/avg cực nhanh.

- **Hệ thống Middleware**: Kiểm tra trạng thái đăng nhập, bắt lỗi hệ thống tự động, cấu hình CORS an toàn cho phép Web và App truy cập đồng thời.

## Công nghệ & Thư viện Sử dụng
- **Runtime**: Node.js Framework Express

- **Database Quản trị**: MongoDB (Mongoose ODM)

- **Database Time-series**: InfluxDB v2

- **Security & Auth**: Passport.js, JsonWebToken, bcryptjs, cors

## Cấu trúc Thư mục Backend
<<<<<<< HEAD
=======
```text
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
backend/
├── controllers/          # Bộ điều hướng xử lý logic nghiệp vụ (Auth, Data, Station)
├── middleware/           # Bộ lọc trung gian bảo vệ route (authMiddleware.js)
├── models/               # Cấu trúc thực thể MongoDB (User.js, Station.js)
├── routes/               # Khai báo Endpoint phân tách luồng (auth.routes.js, co.routes.js)
├── public/               # Nơi lưu trữ tài nguyên static
├── .env                  # File lưu trữ toàn bộ biến môi trường
├── app.js                # Điểm khởi chạy cấu hình tổng Express Server
└── package.json          # Khai báo danh sách các package phụ thuộc
<<<<<<< HEAD
=======
```
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46

## Các bước Cài đặt và Khởi chạy
1. Cài đặt các Package
Di chuyển vào thư mục backend và chạy lệnh cài đặt:
```Bash
npm install
```

2. Thiết lập cấu hình biến môi trường
Tạo file .env nằm ở thư mục gốc của /backend 

3. Khởi chạy Server
```Bash
node app.js
```

## Hướng dẫn Cài đặt InfluxDB nhanh
Trong thư mục hiện tại đã đính kèm sẵn file cấu hình cài đặt InfluxDB dành cho kiến trúc Ubuntu/Debian (influxdb2_2.7.5-1_amd64.deb). Có thể cài đặt nhanh qua lệnh:

```Bash
sudo dpkg -i influxdb2_2.7.5-1_amd64.deb
sudo systemctl start influxdb
```
<<<<<<< HEAD
Lưu ý: Hãy đảm bảo InfluxDB chạy thành công trước khi khởi động Node.js server để tránh lỗi crash kết nối driver.
=======
Lưu ý: Hãy đảm bảo InfluxDB chạy thành công trước khi khởi động Node.js server để tránh lỗi crash kết nối driver.
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
