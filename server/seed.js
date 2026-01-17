const mongoose = require('mongoose');
const Product = require('./models/Product'); 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/BTTT_Web')
  .then(async () => {
    console.log("Đang kết nối để nạp dữ liệu...");
    
    // Xóa dữ liệu cũ để cập nhật mảng mới sạch sẽ
    await Product.deleteMany(); 

const sampleProducts = [
      // --- NHÓM GẤU BÔNG (Hot Trend) ---
      { name: "Gấu Bông Teddy Hồng Pastel", description: "Gấu Teddy lông xù mềm mại, size 40cm.", price: 250000, image: "https://plus.unsplash.com/premium_photo-1670493556860-13e000e6afd4?w=500", category: "Gấu bông", stock: 50 },
      { name: "Gấu Bông Capybara Đeo Balo", description: "Chuột lang nước hot trend kèm balo rùa.", price: 185000, image: "https://images.unsplash.com/photo-1715065444933-78c660419356?w=500", category: "Gấu bông", stock: 30 },
      { name: "Khủng Long Xanh Má Hồng", description: "Khủng long nỉ nhung, phù hợp ôm ngủ.", price: 160000, image: "https://images.unsplash.com/photo-1559440666-3f0f7450700c?w=500", category: "Gấu bông", stock: 45 },
      { name: "Mèo Hoàng Thượng Béo", description: "Gấu bông hình mèo mập ú, biểu cảm khó ở.", price: 210000, image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500", category: "Gấu bông", stock: 25 },
      { name: "Gấu Trúc Panda Mini", description: "Gấu trúc nhỏ cầm cành trúc xinh xắn.", price: 120000, image: "https://images.unsplash.com/photo-1562033800-90696c738154?w=500", category: "Gấu bông", stock: 60 },
      { name: "Heo Hồng Mắt Híp", description: "Heo bông siêu mịn, co giãn 4 chiều.", price: 140000, image: "https://images.unsplash.com/photo-1534127037558-d74843787d39?w=500", category: "Gấu bông", stock: 40 },
      { name: "Thỏ Trắng Tai Dài", description: "Thỏ phong cách Lolita điệu đà.", price: 195000, image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500", category: "Gấu bông", stock: 35 },
      { name: "Gấu Lotso Mùi Dâu", description: "Gấu Lotso nổi tiếng, lông có mùi hương nhẹ.", price: 280000, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500", category: "Gấu bông", stock: 20 },
      { name: "Chim Cánh Cụt Pingu", description: "Cánh cụt tròn trịa, chất liệu vải không xù.", price: 135000, image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500", category: "Gấu bông", stock: 55 },
      { name: "Chó Shiba Cười", description: "Gấu bông Shiba Inu biểu cảm meme.", price: 175000, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500", category: "Gấu bông", stock: 30 },

      // --- NHÓM MÓC KHÓA (Cute & Small) ---
      { name: "Móc Khóa Phi Hành Gia", description: "Nhựa PVC cao cấp, thiết kế vũ trụ.", price: 45000, image: "https://images.unsplash.com/photo-1619134303704-a28e1a689461?w=500", category: "Móc khóa", stock: 100 },
      { name: "Móc Khóa Trà Sữa Trân Châu", description: "Dạng lỏng có hạt chuyển động.", price: 39000, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500", category: "Móc khóa", stock: 150 },
      { name: "Móc Khóa Hoa Cúc họa mi", description: "Bằng len handmade xinh xắn.", price: 35000, image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500", category: "Móc khóa", stock: 80 },
      { name: "Móc Khóa Bánh Croissant", description: "Nhựa dẻo bóp mềm tay (squishy).", price: 30000, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500", category: "Móc khóa", stock: 90 },
      { name: "Móc Khóa Cung Hoàng Đạo", description: "Inox mạ vàng, khắc biểu tượng cung.", price: 55000, image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500", category: "Móc khóa", stock: 120 },
      { name: "Móc Khóa Quả Bơ", description: "Silicone mềm, hình quả bơ má hồng.", price: 25000, image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500", category: "Móc khóa", stock: 200 },
      { name: "Móc Khóa Chân Mèo", description: "Có tiếng kêu 'meo meo' và đèn led.", price: 49000, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500", category: "Móc khóa", stock: 70 },
      { name: "Móc Khóa Loopy", description: "Hải ly Loopy biểu cảm hài hước.", price: 59000, image: "https://images.unsplash.com/photo-1620311458273-4f96d040a45b?w=500", category: "Móc khóa", stock: 40 },
      { name: "Móc Khóa Camera Mini", description: "Nhấn nút có tiếng tách và flash.", price: 65000, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500", category: "Móc khóa", stock: 50 },
      { name: "Móc Khóa Đàn Guitar", description: "Kim loại sơn tĩnh điện tinh xảo.", price: 45000, image: "https://images.unsplash.com/photo-1510915312133-3d238380e227?w=500", category: "Móc khóa", stock: 65 },

      // --- NHÓM STICKER & POSTCARD (Trang trí) ---
      { name: "Set Sticker Vintage 50 Miếng", description: "Chủ đề retro, chống nước tốt.", price: 35000, image: "https://images.unsplash.com/photo-1583244532610-2cb2341dd536?w=500", category: "Sticker", stock: 300 },
      { name: "Sticker Động Vật Mập Mạp", description: "Tấm lớn chứa 20 hình cute.", price: 15000, image: "https://images.unsplash.com/photo-1591154665854-01dbce1a2e41?w=500", category: "Sticker", stock: 500 },
      { name: "Postcard Phong Cảnh Đà Lạt", description: "Giấy mỹ thuật 300gsm in sắc nét.", price: 25000, image: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=500", category: "Postcard", stock: 200 },
      { name: "Set Postcard 12 Cung Hoàng Đạo", description: "Mỗi tờ một cung kèm lời chúc.", price: 85000, image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500", category: "Postcard", stock: 100 },
      { name: "Sticker Hologram Lấp Lánh", description: "Hiệu ứng cầu vồng khi nghiêng.", price: 20000, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500", category: "Sticker", stock: 150 },
      { name: "Sticker Đồ Ăn Việt Nam", description: "Bánh mì, phở, cà phê phin.", price: 18000, image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500", category: "Sticker", stock: 250 },
      { name: "Postcard Thank You", description: "Gửi lời cảm ơn đến người thương.", price: 12000, image: "https://images.unsplash.com/photo-1522673607200-164881eeca48?w=500", category: "Postcard", stock: 400 },
      { name: "Tấm Gỗ Decor Vẽ Tay", description: "Postcard bằng gỗ mỏng trang trí bàn.", price: 75000, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500", category: "Postcard", stock: 30 },
      { name: "Sticker Lettering Truyền Cảm Hứng", description: "Các câu nói hay bằng tiếng Anh.", price: 22000, image: "https://images.unsplash.com/photo-1506784919141-9377488e3306?w=500", category: "Sticker", stock: 180 },
      { name: "Postcard Nhật Ký Du Lịch", description: "Khoảng trống để dán ảnh mini.", price: 30000, image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500", category: "Postcard", stock: 120 },

      // --- NHÓM PHỤ KIỆN (Tiện ích & Decor) ---
      { name: "Kẹp Tóc Nơ Đỏ Nhung", description: "Phong cách tiểu thư, màu đỏ đô.", price: 15000, image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500", category: "Phụ kiện", stock: 80 },
      { name: "Bình Nước Aesthetic 1 Lít", description: "Có vạch nhắc giờ uống nước.", price: 75000, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500", category: "Phụ kiện", stock: 60 },
      { name: "Túi Tote Vải Canvas Trắng", description: "In hình tối giản, đựng được laptop.", price: 65000, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500", category: "Phụ kiện", stock: 90 },
      { name: "Đèn Ngủ Silicon Mèo Con", description: "Cảm ứng đổi 7 màu nhẹ nhàng.", price: 120000, image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500", category: "Phụ kiện", stock: 40 },
      { name: "Vòng Tay Đôi Nam Châm", description: "Gắn kết tình cảm lứa đôi.", price: 55000, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500", category: "Phụ kiện", stock: 110 },
      { name: "Set 5 Bút Gel Pastel", description: "Mực đen, ngòi 0.5mm viết êm.", price: 49000, image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500", category: "Phụ kiện", stock: 300 },
      { name: "Sổ Tay Planner Bìa Da", description: "Lập kế hoạch công việc hằng ngày.", price: 95000, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500", category: "Phụ kiện", stock: 45 },
      { name: "Kính Mát Thời Trang Gọng Tròn", description: "Chống tia UV, phong cách retro.", price: 135000, image: "https://images.unsplash.com/photo-1511499767390-a7390327cbf7?w=500", category: "Phụ kiện", stock: 25 },
      { name: "Tất Cổ Cao Họa Tiết Thổ Cẩm", description: "Chất cotton co giãn thoáng khí.", price: 25000, image: "https://images.unsplash.com/photo-1582966298438-641ff5118563?w=500", category: "Phụ kiện", stock: 200 },
      { name: "Kẹp Sách Kim Loại Mạ Vàng", description: "Hình lá phong, thiết kế tinh xảo.", price: 42000, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500", category: "Phụ kiện", stock: 85 },
      { name: "Ốp Lưng iPhone Tai Mèo", description: "Silicone dẻo bảo vệ máy toàn diện.", price: 85000, image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500", category: "Phụ kiện", stock: 70 },
      { name: "Băng Đô Rửa Mặt Tai Gấu", description: "Vải bông lông cừu siêu mềm.", price: 35000, image: "https://images.unsplash.com/photo-1598440499033-547119f8c4c9?w=500", category: "Phụ kiện", stock: 150 },
      { name: "Khăn Choàng Cổ Len Sọc", description: "Ấm áp cho mùa đông không lạnh.", price: 155000, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500", category: "Phụ kiện", stock: 35 },
      { name: "Túi Đựng Mỹ Phẩm Trong Suốt", description: "Chống nước, khóa kéo chắc chắn.", price: 58000, image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500", category: "Phụ kiện", stock: 100 },
      { name: "Giá Đỡ Điện Thoại Gỗ", description: "Hình chú chó nhỏ trang trí bàn làm việc.", price: 45000, image: "https://images.unsplash.com/photo-1586105251261-72a756657805?w=500", category: "Phụ kiện", stock: 60 },
      { name: "Nến Thơm Tinh Dầu Lavender", description: "Thư giãn sau ngày làm việc mệt mỏi.", price: 145000, image: "https://images.unsplash.com/photo-1603006375271-7f3b904bb90c?w=500", category: "Phụ kiện", stock: 40 },
      { name: "Chuông Gió Nhật Bản Furin", description: "Thủy tinh vẽ tay, âm thanh thanh khiết.", price: 89000, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500", category: "Phụ kiện", stock: 20 },
      { name: "Bàn Di Chuột Phim Hoạt Hình", description: "Kích thước lớn, bề mặt mịn mượt.", price: 55000, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", category: "Phụ kiện", stock: 120 },
      { name: "Đèn Led Dây Trang Trí", description: "Độ dài 5m, dùng cổng USB tiện lợi.", price: 65000, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500", category: "Phụ kiện", stock: 150 },
      { name: "Lịch Để Bàn Mini 2026", description: "In hình vẽ tay cute mỗi tháng.", price: 35000, image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=500", category: "Phụ kiện", stock: 200 }
    ];

    await Product.insertMany(sampleProducts);
    console.log(`Đã nạp thành công ${sampleProducts.length} sản phẩm với ảnh Unsplash!`);
    process.exit();
  })
  .catch(err => {
    console.error("Lỗi nạp dữ liệu:", err);
    process.exit(1);
  });