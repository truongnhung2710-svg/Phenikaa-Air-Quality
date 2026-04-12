# Phenikaa Air Quality - Mobile App

Ứng dụng mobile React Native (Expo) giám sát chất lượng không khí CO, có đầy đủ tính năng tương đương với frontend web.

## Tính năng

- **Authentication**: Đăng nhập, đăng ký, quên mật khẩu (JWT + AsyncStorage)
- **Dashboard**: 4 thẻ thống kê, biểu đồ CO realtime 2 trạm (tự động cập nhật 30s)
- **Quản lý trạm**: Bảng dữ liệu trực tuyến với bộ lọc theo trạm và trạng thái
- **Lịch sử**: Thống kê min/avg/max, xuất CSV qua share sheet
- **Hồ sơ**: Cập nhật thông tin cá nhân, đổi mật khẩu, đăng xuất

## Yêu cầu hệ thống

- **Node.js** >= 18
- **npm** hoặc **yarn**
- **Expo Go** app trên điện thoại (iOS/Android) — [tải từ App Store / Google Play](https://expo.dev/go)
- Hoặc **Xcode** (iOS Simulator) / **Android Studio** (Android Emulator) cho desktop
- Backend Node.js đang chạy tại port `5001`

## Cài đặt

```bash
cd mobile
npm install
```

## Cấu hình API_BASE_URL

Trước khi chạy, cần cấu hình URL backend tại [src/utils/constants.js](src/utils/constants.js):

```javascript
export const API_BASE_URL = 'http://<IP-BACKEND>:5001';
```

### Lấy IP LAN của máy chạy backend

**macOS / Linux:**
```bash
ipconfig getifaddr en0
# hoặc
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
# Tìm dòng "IPv4 Address" của mạng đang dùng
```

### Ví dụ cấu hình

| Trường hợp | `API_BASE_URL` |
|---|---|
| Test trên thiết bị thật cùng WiFi | `http://192.168.1.x:5001` (IP LAN của máy chạy backend) |
| Test trên iOS Simulator | `http://localhost:5001` |
| Test trên Android Emulator | `http://10.0.2.2:5001` (ánh xạ `localhost`) |

> **Quan trọng**: Khi test trên thiết bị thật, điện thoại và máy chạy backend phải cùng một mạng WiFi. Backend cũng phải bind `0.0.0.0` (đã cấu hình sẵn trong [backend/app.js](../backend/app.js)).

## Chạy project với Expo

```bash
cd mobile
npx expo start
```

Sau khi server khởi động, sẽ hiển thị QR code và các lựa chọn:

| Phím | Tác dụng |
|---|---|
| `i` | Mở iOS Simulator (yêu cầu macOS + Xcode) |
| `a` | Mở Android Emulator (yêu cầu Android Studio) |
| `w` | Mở trong trình duyệt web (không khuyến nghị) |
| `r` | Reload app |
| `j` | Mở DevTools debugger |

### Test trên thiết bị thật (khuyến nghị)

1. Cài **Expo Go** trên điện thoại:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Đảm bảo điện thoại và máy tính cùng mạng WiFi
3. Mở Expo Go, quét QR code hiển thị trong terminal:
   - **iOS**: Dùng app Camera hoặc Expo Go
   - **Android**: Dùng nút "Scan QR code" trong Expo Go

### Nếu gặp lỗi "Network request failed"

1. Kiểm tra `API_BASE_URL` đã đúng IP LAN chưa
2. Kiểm tra backend đang chạy: `curl http://<IP>:5001/api/health`
3. Tắt firewall/antivirus tạm thời để kiểm tra
4. Đảm bảo backend đã cấu hình `cors({ origin: true })`

## Cấu trúc project

```
mobile/
├── App.js                          # Entry point
├── app.json                        # Cấu hình Expo
├── src/
│   ├── navigation/                 # React Navigation (stack + tabs)
│   ├── screens/
│   │   ├── auth/                   # Login, Register, ForgotPassword
│   │   ├── DashboardScreen.js
│   │   ├── ManagementScreen.js
│   │   ├── HistoryScreen.js
│   │   └── ProfileScreen.js
│   ├── components/                 # Components dùng chung
│   ├── services/                   # API services (axios)
│   ├── context/AuthContext.js      # Quản lý auth state
│   ├── hooks/                      # useAuth, useRealtimeData
│   ├── utils/                      # storage, constants, helpers
│   └── theme/theme.js              # Dark theme colors
```

## Build và release APK (Android)

Expo cung cấp **EAS Build** — dịch vụ build đám mây, không cần cài Android Studio.

### Bước 1: Cài EAS CLI

```bash
npm install -g eas-cli
```

### Bước 2: Đăng nhập Expo account

```bash
eas login
```

Nếu chưa có account, đăng ký tại [expo.dev/signup](https://expo.dev/signup) (miễn phí).

### Bước 3: Cấu hình EAS Build

Trong thư mục `mobile/`:

```bash
eas build:configure
```

Lệnh này tạo file `eas.json`. Thêm profile build APK vào file:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Bước 4: Build APK

**Build preview (nhanh, cho test):**
```bash
eas build --platform android --profile preview
```

**Build production:**
```bash
eas build --platform android --profile production
```

Quá trình build diễn ra trên cloud của Expo, mất khoảng **10-20 phút**. Sau khi xong:
- Link tải APK sẽ hiển thị trong terminal
- Cũng có thể xem tại [expo.dev/accounts/<your-account>/projects/<project>/builds](https://expo.dev/)

### Bước 5: Cài APK lên điện thoại

1. Tải file `.apk` về điện thoại
2. Mở file để cài đặt
3. Lần đầu cần bật **"Install from unknown sources"** trong Settings > Security

## Build local (không cần cloud)

Nếu muốn build APK trên máy local (không dùng EAS cloud):

### Yêu cầu
- **Java JDK 17**
- **Android Studio** + Android SDK
- Biến môi trường `ANDROID_HOME` trỏ đến Android SDK

### Các bước

```bash
cd mobile

# 1. Tạo thư mục native android
npx expo prebuild --platform android

# 2. Build APK release
cd android
./gradlew assembleRelease

# APK sau khi build nằm tại:
# android/app/build/outputs/apk/release/app-release.apk
```

## Build iOS (IPA)

Build iOS cần:
- Apple Developer Account ($99/năm) để ký app
- Hoặc dùng EAS Build với profile `preview` để tạo bản test nội bộ

```bash
eas build --platform ios --profile preview
```

## Troubleshooting

**Lỗi `Metro bundler can't find module`:**
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start -c    # xóa cache
```

**Lỗi chart không hiển thị:**
- Kiểm tra `react-native-svg` đã cài đặt: `npx expo install react-native-svg`

**Lỗi Picker không hoạt động trên iOS:**
- Đảm bảo đã chạy: `npx expo install @react-native-picker/picker`

**App không kết nối được backend:**
- Kiểm tra `API_BASE_URL` trong [src/utils/constants.js](src/utils/constants.js)
- Test backend: `curl http://<API_BASE_URL>/api/health`
- Backend phải bind `0.0.0.0` chứ không phải `127.0.0.1`

## Scripts npm

| Lệnh | Tác dụng |
|---|---|
| `npx expo start` | Khởi động dev server |
| `npx expo start -c` | Khởi động và xóa cache |
| `npx expo start --tunnel` | Dùng tunnel (khi khác mạng) |
| `eas build -p android --profile preview` | Build APK preview |
| `eas build -p android --profile production` | Build APK production |
| `eas build -p ios --profile preview` | Build IPA preview |

## Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
