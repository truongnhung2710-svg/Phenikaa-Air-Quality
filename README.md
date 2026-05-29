# Phenikaa Air Quality 

## Yêu cầu Cài đặt Hệ thống
Để thiết lập toàn bộ hệ thống chạy trên môi trường Local, máy tính cần sẵn sàng các công cụ:

- **Node.js** >= 18.x và quản lý gói npm 

- **MongoDB Server** (MongoDB Atlas cloud)

- **InfluxDB OSS** v2.7+ (Dùng để lưu chuỗi dữ liệu CO theo mốc thời gian)

- **Expo Go** (Cài đặt sẵn trên smartphone iOS/Android để chạy ứng dụng di động)

## Hướng dẫn Kích hoạt Hệ thống Nhanh
Mở 3 cửa sổ Terminal độc lập để chạy đồng thời các dịch vụ theo thứ tự:

1. Khởi chạy Máy chủ Backend
```Bash
cd backend
npm install
```
<<<<<<< HEAD
# Cấu hình đầy đủ các biến môi trường trong file .env trước khi chạy
=======
Cấu hình đầy đủ các biến môi trường trong file .env trước khi chạy
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
```bash 
node app.js
```
API Server lắng nghe tại cổng: http://localhost:5001

2. Khởi chạy Web Dashboard
```Bash
cd frontend/web
npm install
npm start
```

3. Khởi chạy Mobile App
```Bash
cd frontend/app
npm install
npx expo start
```
<<<<<<< HEAD
Sử dụng app Expo Go trên điện thoại quét mã QR hiển thị ở màn hình terminal để kiểm thử.
=======
Sử dụng app Expo Go trên điện thoại quét mã QR hiển thị ở màn hình terminal để kiểm thử.
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
