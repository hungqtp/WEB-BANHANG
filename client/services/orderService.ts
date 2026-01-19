import axios from 'axios';

export const getVnpayUrl = async (orderId: string, amount: number) => {
  try {
    const res = await axios.post('http://localhost:5000/api/orders/create_vnpay_url', {
      orderId: String(orderId),           // Đảm bảo là chuỗi
      amount: Number(amount)              // Đảm bảo là số (VNPAY cần số nguyên)
    });
    
    // Kiểm tra xem res.data có thực sự chứa paymentUrl không
    if (res.data && res.data.paymentUrl) {
        return res.data;
    } else {
        console.error("Dữ liệu Backend trả về thiếu field paymentUrl:", res.data);
        return null;
    }
  } catch (error: any) {
    console.error("Lỗi kết nối Backend:", error.response?.data || error.message);
    throw error;
  }
};