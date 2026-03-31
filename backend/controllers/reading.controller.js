const Reading = require('../models/Reading');
const Alert = require('../models/Alert');
const Device = require('../models/Device');
const { InfluxDB } = require('@influxdata/influxdb-client');

// Khởi tạo kết nối InfluxDB để đọc dữ liệu
// (Đảm bảo bạn đã có INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET trong file .env)
const influxDB = new InfluxDB({ 
  url: process.env.INFLUX_URL || 'http://192.168.234.129:8086', 
  token: process.env.INFLUX_TOKEN 
});
const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG || 'phenikaa');

const CO_THRESHOLD = 30; // Ngưỡng của bạn đang để là 30

exports.createReading = async (req, res) => {
  try {
    const { deviceId, coValue } = req.body;
    
    if (!deviceId || coValue === undefined) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // 1. Lưu Reading (Lịch sử đo đạc)
    const reading = new Reading({
      devEui: deviceId,       
      deviceName: deviceId,   
      co_ppm: coValue,        
      unit: 'ppm',
      status: coValue > CO_THRESHOLD ? 'warning' : 'normal'
    });
    await reading.save();

    // 2. Kiểm tra vượt ngưỡng và lưu Alert
    if (coValue > CO_THRESHOLD) {
      const alert = new Alert({
        deviceId,
        coValue,
        threshold: CO_THRESHOLD,
        status: coValue > 2 * CO_THRESHOLD ? 'DANGER' : 'WARNING'
      });
      await alert.save();
    }

    // 3. CẬP NHẬT TRẠNG THÁI TRẠM (DEVICE) VÀO MONGODB
    await Device.findOneAndUpdate(
      { deviceId: deviceId }, 
      { 
        $set: { 
          status: 'online',
          // location: 'Khu A' (Bạn có thể fix cứng location hoặc truyền từ Frontend lên sau này)
        } 
      }, 
      { upsert: true, new: true } 
    );

    res.json({
      message: 'Reading saved and Device updated',
      reading 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- HÀM LẤY LỊCH SỬ TỪ INFLUXDB ---
exports.getHistory = async (req, res) => {
  try {
    const bucket = process.env.INFLUX_BUCKET || 'co_monitoring';
    
    // Lệnh Flux tìm dữ liệu chuẩn mà ChirpStack (hoặc tool giả lập) bắn sang
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -1h) 
        |> filter(fn: (r) => r._measurement == "device_frmpayload" and r._field == "co_ppm")
        |> group() // 👈 THÊM DÒNG NÀY: Đập bỏ vách ngăn, trộn chung tất cả các trạm
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 60) // 👈 THÊM DÒNG NÀY: Dặn Backend chỉ lấy 60 dòng mới nhất cho web chạy cực nhanh
    `;
    const results = [];
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        results.push({
          station: o.device_id ? o.device_id.replace('TRAM_0', '') : '1', // Rút gọn TRAM_01 thành 1
          time: new Date(o._time).toLocaleString('vi-VN'),
          value: o._value,
          isWarning: o._value >= 30 
        });
      },
      error(error) {
        console.error("Lỗi lấy dữ liệu InfluxDB:", error);
        res.status(500).json({ error: error.message });
      },
      complete() {
        res.json(results); // Trả mảng dữ liệu về cho React
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
