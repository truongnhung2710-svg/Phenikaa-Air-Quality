// mock_chirpstack.js - Kẻ đóng thế ChirpStack bơm data vào InfluxDB
require('dotenv').config();
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Lấy thông tin kết nối từ file .env của bạn
const influxDB = new InfluxDB({ 
  url: process.env.INFLUX_URL || 'http://192.168.234.129:8086', 
  token: process.env.INFLUX_TOKEN 
});
const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG || 'phenikaa', process.env.INFLUX_BUCKET || 'co_monitoring', 'ns');

console.log("🚀 Bắt đầu giả lập ChirpStack đẩy dữ liệu sang InfluxDB...");

setInterval(() => {
  // Tạo nồng độ CO ngẫu nhiên
  const val1 = Math.floor(Math.random() * 16) + 10; // Trạm 1: 10 - 25 ppm
  const val2 = Math.floor(Math.random() * 26) + 20; // Trạm 2: 20 - 45 ppm

  // Tạo điểm dữ liệu Y HỆT ĐỊNH DẠNG CỦA CHIRPSTACK
  const point1 = new Point('device_frmpayload') // Tên mặc định của ChirpStack
    .tag('device_id', 'TRAM_01')                // ChirpStack dùng tag này để phân biệt trạm
    .floatField('co_ppm', val1);

  const point2 = new Point('device_frmpayload')
    .tag('device_id', 'TRAM_02')
    .floatField('co_ppm', val2);

  writeApi.writePoint(point1);
  writeApi.writePoint(point2);
  writeApi.flush(); // Đẩy thẳng vào InfluxDB

  console.log(`[ChirpStack Ảo] -> Đã ghi InfluxDB: TRAM_01 (${val1} ppm) | TRAM_02 (${val2} ppm)`);
}, 5000); // 5 giây bắn 1 lần
