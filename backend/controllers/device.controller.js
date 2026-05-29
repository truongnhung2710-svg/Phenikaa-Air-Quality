<<<<<<< HEAD
const { InfluxDB } = require('@influxdata/influxdb-client');
const Device = require('../models/Device');

const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN || 'TwK84vsITspF-nRBDmqO5qD0YNVSKwBcNMFAf8gl5MzF6DTX_CMHMiZ-SMIKnpfO-cbWNU6P4_AdZsAtbascyw==';
const org = process.env.INFLUX_ORG || 'd9156a45a9da2782';
const bucket = process.env.INFLUX_BUCKET || 'chirpstack_data';
const measurement = 'device_data'; 

exports.getChirpStackStatus = async (req, res) => {
  try {
    const deviceList = [
      { deviceId: "005c005531383630", name: "CO_Sensor_1", location: "Phòng Lab IoT" },
      { deviceId: "0037001931383630", name: "CO_Sensor_2", location: "Phòng Thực hành" }
    ];

    let online = 0;
    let offline = 0;

    // Khởi tạo kết nối truy vấn
    const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

    for (const dev of deviceList) {
      const eui = dev.deviceId;

      const fluxQuery = `
        from(bucket: "${bucket}")
          |> range(start: -2m)
          |> filter(fn: (r) => r["_measurement"] == "${measurement}")
          |> filter(fn: (r) => r["topic"] =~ /${eui}/)
          |> limit(n: 1)
      `;

      let isOnline = false;

      // Thực thi truy vấn InfluxDB
      await new Promise((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next(row, tableMeta) {
            isOnline = true; 
          },
          error(error) {
            reject(error);
          },
          complete() {
            resolve();
          },
        });
      });

      // Xác định trạng thái hiện tại
      const currentStatus = isOnline ? 'online' : 'offline';

      
      await Device.findOneAndUpdate(
        { deviceId: eui }, // Tìm kiếm thiết bị theo mã DevEUI
        {
          $set: {
            name: dev.name,
            location: dev.location,
            status: currentStatus
          }
        },
        { 
          upsert: true, 
          new: true 
        } 
      );

      // Đếm số lượng để trả về cho Frontend
      if (isOnline) {
        online++;
      } else {
        offline++;
      }
    }

    console.log(`✅ [Tự động đồng bộ] Trạng thái: Online ${online} | Offline ${offline}`);
    res.json({ online, offline });

  } catch (error) {
    console.error("❌ Lỗi truy vấn:", error.message);
    res.status(500).json({ online: 0, offline: 2, error: "Lỗi kết nối hoặc đồng bộ" });
  }
};


exports.createDevice = async (req, res) => {
  try {
    const { deviceId, name, location, status } = req.body;

    const newDevice = new Device({
      deviceId: deviceId,
      name: name,
      location: location, 
      status: status || 'online'
    });

    await newDevice.save();
    
    console.log(`✅ Đã lưu trạm mới vào MongoDB: ${deviceId} tại ${location}`);
    res.status(201).json({ message: 'Tạo thiết bị thành công', data: newDevice });

  } catch (error) {
    console.error('❌ Lỗi tạo thiết bị:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
=======
const Device = require('../models/Device');

// POST: tạo trạm (mock)
exports.createDevice = async (req, res) => {
  try {
    const { deviceId, location } = req.body;

    const device = new Device({ deviceId, location });
    await device.save();

    res.json({
      message: 'Device created',
      device
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET: lấy danh sách trạm
exports.getDevices = async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
};
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
