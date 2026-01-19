const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const moment = require("moment");

router.post('/create_vnpay_url', (req, res) => {
    try {
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        
        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        const vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURNURL;

        const amount = req.body.amount;
        const orderId = req.body.orderId;

        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': orderId,
            // Viết liền không dấu để test cho chắc chắn
            'vnp_OrderInfo': 'ThanhToanDonHang' + orderId,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': '127.0.0.1',
            'vnp_CreateDate': createDate
        };

        // 1. Sắp xếp key theo alphabet
        const sortedKeys = Object.keys(vnp_Params).sort();
        
        // 2. Tạo chuỗi dữ liệu ký và chuỗi query thủ công 
        // VNPAY yêu cầu: Chuỗi ký dùng giá trị chưa encode, URL dùng giá trị đã encode
        let signData = "";
        let queryData = "";

        for (let i = 0; i < sortedKeys.length; i++) {
            const key = sortedKeys[i];
            const value = vnp_Params[key];

            if (i > 0) {
                signData += "&";
                queryData += "&";
            }
            signData += key + "=" + value;
            queryData += encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }

        // 3. Ký HMAC-SHA512 với secretKey
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        
        // 4. URL cuối cùng
        const finalUrl = vnpUrl + "?" + queryData + "&vnp_SecureHash=" + signed;
        
        console.log("Chuỗi ký thực tế:", signData);
        res.json({ paymentUrl: finalUrl });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
});

module.exports = router;