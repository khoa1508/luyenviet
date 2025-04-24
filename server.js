// server.js

const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Khởi tạo Socket.IO

const PORT = process.env.PORT || 3000; // Cổng mặc định là 3000

// Phục vụ các tệp tĩnh (HTML, CSS, JS phía client) từ thư mục hiện tại
app.use(express.static('.'));

// Lắng nghe các kết nối Socket.IO
io.on('connection', (socket) => {
    console.log(`(+) Người dùng mới kết nối: ${socket.id}`);

    // Lắng nghe hành động vẽ/tẩy từ client
    socket.on('draw_action', (data) => {
        // Phát lại hành động này cho tất cả client khác
        // console.log("-> Phát lại draw_action:", data.mode); // Log nếu cần debug
        socket.broadcast.emit('draw_action', data);
    });

    // Lắng nghe hành động đặt chữ từ client
    socket.on('text_action', (data) => {
        console.log("-> Phát lại text_action:", data.text);
        socket.broadcast.emit('text_action', data);
    });

    // Lắng nghe hành động xóa hết từ client
    socket.on('clear_action', () => {
        console.log("-> Phát lại clear_action");
        socket.broadcast.emit('clear_action');
    });

    // Lưu ý: Chúng ta sẽ không đồng bộ hóa Undo ở bước này vì nó phức tạp
    // và dễ gây mất đồng bộ giữa các client nếu chỉ gửi tín hiệu đơn giản.

    // Xử lý khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log(`(-) Người dùng ngắt kết nối: ${socket.id}`);
    });
});

// Khởi động server
server.listen(PORT, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${PORT}`);
    console.log("Mở trình duyệt và truy cập địa chỉ trên.");
    console.log("Để thử nghiệm, hãy mở thêm một cửa sổ trình duyệt khác và truy cập cùng địa chỉ.");
});