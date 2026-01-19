const express = require('express');
const router = express.Router();
const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');

router.post('/create_vnpay_url', (req, res) => {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;

    const orderId = req.body.orderId;
    const amount = req.body.amount; // Số tiền đơn hàng
    const bankCode = req.body.bankCode || ''; // Có thể để trống để khách tự chọn ngân hàng

    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': 'Thanh toan don hang HuMi:' + orderId,
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100, // VNPAY yêu cầu nhân 100
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        'vnp_CreateDate': createDate,
    };

    if (bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }
    // API IPN: VNPAY sẽ gọi ngầm vào đây để xác nhận thanh toán
    router.get('/vnpay_ipn', async (req, res) => {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = Object.keys(vnp_Params).sort().reduce((obj, key) => {
            obj[key] = vnp_Params[key];
            return obj;
        }, {});

        const secretKey = process.env.VNP_HASHSECRET;
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];

            if (rspCode === '00') {
                // CODE CỦA ÔNG Ở ĐÂY: Tìm đơn hàng trong DB và cập nhật isPaid = true
                // await Order.findOneAndUpdate({ orderId: orderId }, { isPaid: true, status: 'Đã thanh toán' });
                res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
                res.status(200).json({ RspCode: '01', Message: 'Fail' });
            }
        } else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
        }
    });

    // Sắp xếp object theo thứ tự abc (Bắt buộc theo quy định VNPAY)
    vnp_Params = Object.keys(vnp_Params).sort().reduce((obj, key) => {
        obj[key] = vnp_Params[key];
        return obj;
    }, {});

    // Tạo mã băm bảo mật (Secure Hash)
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    res.status(200).json({ paymentUrl: vnpUrl });

});