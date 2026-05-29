const Reading = require('../models/Reading');
const Alert = require('../models/Alert');
const Device = require('../models/Device');
const { InfluxDB } = require('@influxdata/influxdb-client');
<<<<<<< HEAD
const axios = require('axios');

// Khởi tạo kết nối InfluxDB để đọc dữ liệu
=======

// Khởi tạo kết nối InfluxDB để đọc dữ liệu
// (Đảm bảo bạn đã có INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET trong file .env)
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
const influxDB = new InfluxDB({ 
  url: process.env.INFLUX_URL || 'http://192.168.234.129:8086', 
  token: process.env.INFLUX_TOKEN 
});
<<<<<<< HEAD

const getChirpStackStatus = async (req, res) => {
  try {
    const CHIRPSTACK_URL = 'http://192.168.234.129:8080/api/devices';
    
    const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'; 
    const devEuis = ["005c005531383630", "0037001931383630"];

    let online = 0;
    let offline = 0;

    const requests = devEuis.map(eui => 
      axios.get(`${CHIRPSTACK_URL}/${eui}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` } 
      })
    );

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      const device = response.data.device;
      
      if (device.lastSeenAt) {
        const lastSeen = new Date(device.lastSeenAt);
        const now = new Date();
        const diffMinutes = (now - lastSeen) / (60 * 1000);

        // Nếu thiết bị hoạt động trong vòng 15 phút qua
        if (diffMinutes < 15) {
          online++;
        } else {
          offline++;
        }
      } else {
        // Nếu chưa bao giờ thấy thiết bị gửi dữ liệu
        offline++;
      }
    });

    res.json({ online, offline });
    console.log(`[ChirpStack] Trạng thái: Online ${online}, Offline ${offline}`);

  } catch (error) {
    console.error("Lỗi kết nối ChirpStack:", error.message);
    res.status(500).json({ error: "Không thể kết nối ChirpStack", message: error.message });
  }
};

const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG || 'phenikaa');

const CO_THRESHOLD = 5; 
=======
const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG || 'phenikaa');

const CO_THRESHOLD = 30; // Ngưỡng của bạn đang để là 30

>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
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
<<<<<<< HEAD
 // 2. Kiểm tra vượt ngưỡng và lưu Alert
=======

    // 2. Kiểm tra vượt ngưỡng và lưu Alert
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
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
<<<<<<< HEAD
=======
          // location: 'Khu A' (Bạn có thể fix cứng location hoặc truyền từ Frontend lên sau này)
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
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
<<<<<<< HEAD
// --- HÀM LẤY LỊCH SỬ TỪ INFLUXDB 
exports.getHistory = async (req, res) => {
  try {
    const bucket = process.env.INFLUX_BUCKET || 'chirpstack_data';
    const { start, end } = req.query;

    
    const getVnToUtc = (dateStr, isEnd) => {
      const [year, month, day] = dateStr.split('-');

      const date = new Date(Date.UTC(year, month - 1, day));

      if (isEnd) {
        
        date.setUTCHours(16, 59, 59, 999);
      } else {
        
        date.setUTCDate(date.getUTCDate() - 1);
        date.setUTCHours(17, 0, 0, 0);
      }
      return date.toISOString(); // InfluxDB nhận chuẩn chuỗi Z
    };

    const startTime = start ? getVnToUtc(start, false) : "-24h";
    const endTime = end ? getVnToUtc(end, true) : "now()";
    // --- KẾT THÚC SỬA LỖI ---

    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime}, stop: ${endTime}) 
        |> filter(fn: (r) => r._measurement == "device_data")
        |> filter(fn: (r) => r._field == "co_ppm")
        |> group() 
        |> sort(columns: ["_time"], desc: true)
    `;
    
=======

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
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
    const results = [];
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
<<<<<<< HEAD

        let devEui = "";
        if (o.topic && o.topic.includes('device/')) {
            devEui = o.topic.split('device/')[1].split('/')[0];
        }
        let tenTram = "1"; 
        let devEuiLower = devEui.toLowerCase();

        if (devEuiLower.includes("005c")) {
            tenTram = "1"; 
        } else if (devEuiLower.includes("0037")) {
            tenTram = "2"; 
        }
        results.push({
          station: tenTram, 
          time: new Date(o._time).toLocaleString('vi-VN'),
          value: o._value, 
          co: o._value,    
=======
        results.push({
          station: o.device_id ? o.device_id.replace('TRAM_0', '') : '1', // Rút gọn TRAM_01 thành 1
          time: new Date(o._time).toLocaleString('vi-VN'),
          value: o._value,
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
          isWarning: o._value >= 30 
        });
      },
      error(error) {
<<<<<<< HEAD
        console.error("❌ Lỗi lấy dữ liệu InfluxDB:", error);
        res.status(500).json({ error: error.message });
      },
      complete() {
        res.json(results); 
=======
        console.error("Lỗi lấy dữ liệu InfluxDB:", error);
        res.status(500).json({ error: error.message });
      },
      complete() {
        res.json(results); // Trả mảng dữ liệu về cho React
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
