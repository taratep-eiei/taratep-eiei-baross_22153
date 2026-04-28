const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 1. ตั้งค่า Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 2. เชื่อมต่อฐานข้อมูล XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'baross_db' 
});

db.connect((err) => {
    if (err) {
        console.error('❌ เชื่อมต่อ MySQL ไม่สำเร็จ: ' + err.message);
        return;
    }
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จแล้ว!');
});

// หน้าแรก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html')); 
});

// 3. ระบบสมัครสมาชิก (Register)
app.post('/register', (req, res) => {
    const user = req.body.reg_user;
    const pass = req.body.reg_pass;
    const confirm = req.body.reg_confirm_pass;

    if (pass !== confirm) {
        return res.redirect('/register.html?status=mismatch');
    }

    const checkUserSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkUserSql, [user], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล");
        }

        if (results.length > 0) {
            console.log(`⚠️ ชื่อซ้ำ: ${user}`);
            return res.redirect('/register.html?status=exists');
        }

        const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(insertSql, [user, pass], (err, result) => {
            if (err) {
                console.error(err);
                return res.send("เกิดข้อผิดพลาดในการบันทึก");
            }
            res.redirect('/login.html?status=registered');
        });
    });
});

// 4. ระบบเข้าสู่ระบบ (Login) - ปรับใหม่ให้เด้งกลับหน้า index พร้อมชื่อ user
app.post('/login', (req, res) => {
    const user = req.body.username;
    const pass = req.body.password;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [user, pass], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }

        if (results.length > 0) {
            // ✅ เปลี่ยนจาก res.send เป็นการ redirect กลับหน้าแรกพร้อมแนบชื่อ user
            console.log(`✅ ${user} ล็อกอินสำเร็จ`);
            res.redirect(`/?user=${user}`);
        } else {
            // ถ้าล็อคอินไม่ผ่าน ดีดกลับหน้า login พร้อมบอกว่า error
            res.redirect('/login.html?status=error');
        }
    });
});

// 5. เปิด Server
app.listen(port, () => {
    console.log(`🚀 Server ของ Baross รันแล้วที่ http://localhost:${port}`);
});