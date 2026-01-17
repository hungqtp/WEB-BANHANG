import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// --- ĐỊNH NGHĨA TYPES ---
interface Message {
  text: string | React.ReactNode;
  sender: "bot" | "user";
  type?: "text" | "product" | "info" | "error";
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

// --- CẤU HÌNH TỪ KHÓA & PHẢN HỒI (THE BRAIN) ---
const KNOWLEDGE_BASE = {
  greetings: {
    keywords: ["chào", "hi", "hello", "alo", "ê", "shop ơi", "ad ơi", "tư vấn"],
    responses: [
      "HuMi nghe đây mày ơi! Mày đang tìm gấu bông tặng gấu hay mua về ôm cho đỡ cô đơn thế? 🧸",
      "Hế lô! Hôm nay mày muốn tiêu tiền vào món đồ xinh xắn nào bên tao nào? ✨",
      "Chào mày nhé! Shop tao đang có nhiều mẫu mới về lắm, mày cần tìm gì tao dẫn đi xem!"
    ]
  },
  shipping: {
    keywords: ["ship", "vận chuyển", "giao hàng", "bao lâu", "phí", "tận nơi", "cod"],
    responses: [
      "Bên tao ship nội thành Hà Nội thì trong ngày, tỉnh lẻ thì 2-3 ngày là mày có gấu ôm nhé. Phí ship đồng giá 25k, đơn trên 500k tao bao ship luôn! 📦",
      "Mày cứ yên tâm, tao đóng gói kỹ lắm, nhận hàng kiểm tra thoải mái rồi mới trả tiền (COD) nha!"
    ]
  },
  location: {
    keywords: ["địa chỉ", "ở đâu", "shop đâu", "cửa hàng", "xem hàng", "hà nội", "hcm"],
    responses: [
      "Hiện tại tao bán online là chính để tối ưu giá rẻ nhất cho mày. Kho tao ở Hà Nội, ship cái rẹt là tới! 🏠",
      "Mày cứ lựa trên web đi, ảnh tao tự chụp 100%, không giống tao đền tiền gấp đôi!"
    ]
  },
  payment: {
    keywords: ["chuyển khoản", "thanh toán", "banking", "momo", "thẻ", "tiền mặt"],
    responses: [
      "Mày có thể thanh toán khi nhận hàng (COD) hoặc chuyển khoản qua Techcombank/Momo cho tao cũng được. Nhắn tin riêng tao gửi số tài khoản nhé! 💳"
    ]
  },
  return_policy: {
    keywords: ["đổi trả", "lỗi", "hỏng", "không giống", "trả hàng", "bảo hành"],
    responses: [
      "Nếu hàng lỗi do tao hoặc không giống ảnh, mày cứ gửi lại, tao đổi con mới hoặc hoàn tiền trong 7 ngày không hỏi nhiều! ✅"
    ]
  },
  discount: {
    keywords: ["giảm giá", "sale", "khuyến mãi", "voucher", "code", "rẻ hơn"],
    responses: [
      "Mày theo dõi Fanpage HuMi đi, thi thoảng tao tung voucher giảm 50k đó. Mà giá hiện tại là đang 'hạt dẻ' nhất rồi mày ơi! 💸"
    ]
  },
  human_support: {
    keywords: ["gặp người", "nhân viên", "chủ shop", "số điện thoại", "sdt", "zalo"],
    responses: [
      "Mày cần gặp 'người thật' à? Đợi chút tao báo chủ shop vào rep mày ngay, hoặc gọi hotline: 09xx.xxx.xxx nhé! 📞"
    ]
  }
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Chào mày! Tao là trợ lý ảo của HuMi. Mày cần tìm gì cứ gõ vào đây nhé! 🤖", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [quickActions, setQuickActions] = useState(["Tìm Gấu 🧸", "Phí Ship 📦", "Địa chỉ 🏠"]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch dữ liệu sản phẩm để tư vấn
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi lấy data sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  // 2. Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // 3. LOGIC XỬ LÝ NGÔN NGỮ (THE ENGINE)
  const processInput = (userInput: string) => {
    const text = userInput.toLowerCase().trim();

    // A. Kiểm tra tìm sản phẩm (Dựa trên tên/danh mục trong DB)
    const matchedProducts = products.filter(p => 
      text.includes(p.name.toLowerCase()) || 
      text.includes(p.category?.toLowerCase()) ||
      (text.includes("mẫu") && p.name.toLowerCase().includes(text.replace("mẫu", "").trim()))
    );

    if (matchedProducts.length > 0) {
      setQuickActions(["Mua hàng kiểu gì", "Có được đổi không?", "Gọi chủ ra đây gặp tao","Lính đâu"]);
      return (
        <div className="space-y-3">
          <p className="font-semibold text-pink-600 italic">Tao tìm thấy mấy món này mày xem có ưng không:</p>
          <div className="grid grid-cols-1 gap-2">
            {matchedProducts.slice(0, 4).map(p => (
              <Link key={p._id} to={`/product/${p._id}`} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-pink-100 hover:shadow-md transition group">
                <img src={p.image} className="w-14 h-14 object-cover rounded-lg" alt={p.name} />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate group-hover:text-pink-500">{p.name}</p>
                  <p className="text-[11px] text-rose-500 font-black">{p.price.toLocaleString()}đ</p>
                </div>
                <div className="text-pink-300">➜</div>
              </Link>
            ))}
          </div>
          {matchedProducts.length > 4 && <p className="text-[10px] text-gray-400 text-center">Vẫn còn nhiều lắm, mày vào cửa hàng xem tiếp nhé...</p>}
        </div>
      );
    }

    // B. Kiểm tra hệ thống từ khóa Knowledge Base
    for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
      if (value.keywords.some(k => text.includes(k))) {
        // Thay đổi Quick Actions dựa trên chủ đề
        if (key === 'shipping') setQuickActions(["Mua 2 tặng 1 không", "Ship hà nội lâu không"]);
        if (key === 'greetings') setQuickActions(["Áo", "Gấu", "Móc đâu"]);
        
        return value.responses[Math.floor(Math.random() * value.responses.length)];
      }
    }

    // C. Trường hợp không hiểu
    setQuickActions(["Zalo", "Xem tất cả sản phẩm", "Voucher hôm nay"]);
    return (
      <div className="space-y-2">
        <p>Giề, Nói liên tục đi</p>
        <p className="text-[11px] text-gray-500 italic text-pink-400">Tao là máy không phải người</p>
      </div>
    );
  };

  const handleSend = (content?: string) => {
    const finalInput = content || input;
    if (!finalInput.trim()) return;

    setMessages(prev => [...prev, { text: finalInput, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    // Giả lập thời gian suy nghĩ của Bot
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = processInput(finalInput);
      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    }, 800 + Math.random() * 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans text-gray-800">
      {/* KHUNG CHAT CHÍNH */}
      {isOpen && (
        <div className="bg-white w-[360px] h-[550px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex flex-col overflow-hidden border border-pink-50 animate-in slide-in-from-bottom-10 duration-300">
          
          {/* HEADER CHUYÊN NGHIỆP */}
          <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-5 text-white shadow-lg relative">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner rotate-3">🧸</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h4 className="font-black text-sm tracking-wide">HuMi Assistant v2.0</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
                  <p className="text-[10px] font-medium text-pink-100 uppercase">Sẵn sàng tư vấn</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all text-2xl"
            >
              &times;
            </button>
          </div>

          {/* VÙNG HIỂN THỊ TIN NHẮN */}
          <div className="flex-1 p-5 overflow-y-auto bg-[#fdfafb] space-y-5 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-500`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === "user" 
                  ? "bg-pink-500 text-white rounded-tr-none font-medium" 
                  : "bg-white text-gray-700 border border-pink-50 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-pink-50 flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK ACTIONS (GỢI Ý NHANH) */}
          <div className="px-4 py-3 bg-white border-t border-pink-50">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {quickActions.map(action => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="whitespace-nowrap px-4 py-1.5 bg-pink-50 text-pink-600 text-[11px] font-bold rounded-full border border-pink-100 hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Ô NHẬP LIỆU */}
          <div className="p-4 bg-white border-t border-pink-50 flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-[13px] outline-none focus:ring-2 focus:ring-pink-200 transition-all placeholder:text-gray-400 shadow-inner"
                placeholder="Mày cần hỏi gì cứ nhắn đây nha..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-bold uppercase tracking-widest pointer-events-none">
                Enter
              </div>
            </div>
            <button 
              onClick={() => handleSend()} 
              className="bg-pink-500 text-white p-3.5 rounded-2xl hover:bg-pink-600 shadow-lg shadow-pink-200 transition-all active:scale-90 flex items-center justify-center group"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* NÚT BẤM BÓNG CHÁT (FLOATING ACTION BUTTON) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-pink-500 text-white p-4.5 rounded-[2rem] shadow-[0_15px_45px_rgba(244,114,182,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group border-4 border-white/50 backdrop-blur-sm"
        >
          <div className="relative">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full border-2 border-white animate-bounce shadow-md"></span>
          </div>
          <span className="font-black text-sm tracking-tight pr-2">CHAT VỚI HUMI ✨</span>
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
      `}</style>
    </div>
  );
}