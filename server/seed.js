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
      { name: "Gấu Bông Teddy Hồng Pastel", description: "Gấu Teddy lông xù mềm mại, size 40cm.", price: 250000, image: "https://bizweb.dktcdn.net/100/333/744/products/gb-11-1250gau-bong.jpg?v=1582617667903", category: "Gấu bông", stock: 50 },
      { name: "Gấu Bông Capybara Đeo Balo", description: "Chuột lang nước hot trend kèm balo rùa.", price: 185000, image: "https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936200881427-3.jpg.webp", category: "Gấu bông", stock: 30 },
      { name: "Khủng Long Xanh Má Hồng", description: "Khủng long nỉ nhung, phù hợp ôm ngủ.", price: 160000, image: "https://benibear.vn/wp-content/uploads/2024/08/Khung-long-xanh-ma-hong.png", category: "Gấu bông", stock: 45 },
      { name: "Mèo Hoàng Thượng Béo", description: "Gấu bông hình mèo mập ú, biểu cảm khó ở.", price: 210000, image: "https://upload.bemori.vn/thu-bong/meo-bong/meo-hoang-thuong-bong-beo/meo-hoang-thuong-beo-0.webp", category: "Gấu bông", stock: 25 },
      { name: "Gấu Trúc Panda Mini", description: "Gấu trúc nhỏ cầm cành trúc xinh xắn.", price: 120000, image: "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljbqlyrprk5u71", category: "Gấu bông", stock: 60 },
      { name: "Heo Hồng Mắt Híp", description: "Heo bông siêu mịn, co giãn 4 chiều.", price: 140000, image: "https://img.lazcdn.com/g/p/1db9addb04a0faad7d70035448b9b570.jpg_960x960q80.jpg_.webp", category: "Gấu bông", stock: 40 },
      { name: "Thỏ Trắng Tai Dài", description: "Thỏ phong cách Lolita điệu đà.", price: 195000, image: "https://bizweb.dktcdn.net/thumb/large/100/443/377/products/179-1735805837677.jpg?v=1735805842077", category: "Gấu bông", stock: 35 },
      { name: "Gấu Lotso Mùi Dâu", description: "Gấu Lotso nổi tiếng, lông có mùi hương nhẹ.", price: 280000, image: "https://salt.tikicdn.com/cache/550x550/ts/product/8c/43/1b/b6a816f8584b1f1d45dfebbf38b0f606.jpeg", category: "Gấu bông", stock: 20 },
      { name: "Chim Cánh Cụt Pingu", description: "Cánh cụt tròn trịa, chất liệu vải không xù.", price: 135000, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/450/808/products/o1cn015twsup2209yyj5s85-2217056267057-0-cib-1718500887211.jpg?v=1721360254127", category: "Gấu bông", stock: 55 },
      { name: "Chó Shiba Cười", description: "Gấu bông Shiba Inu biểu cảm meme.", price: 175000, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/450/808/products/a33a1acc-e760-4a9b-b885-8ed85b208b98.jpg?v=1729670627077", category: "Gấu bông", stock: 30 },

      // --- NHÓM MÓC KHÓA (Cute & Small) ---
      { name: "Móc Khóa Phi Hành Gia", description: "Nhựa PVC cao cấp, thiết kế vũ trụ.", price: 45000, image: "https://trumsiaz.com/upload/product/mockhoatrumsiaz-4577.jpg", category: "Móc khóa", stock: 100 },
      { name: "Móc Khóa Trà Sữa Trân Châu", description: "Dạng lỏng có hạt chuyển động.", price: 39000, image: "https://down-vn.img.susercontent.com/file/e077a075d004b4cc3057f2a6411be564", category: "Móc khóa", stock: 150 },
      { name: "Móc Khóa Hoa Cúc họa mi", description: "Bằng len handmade xinh xắn.", price: 35000, image: "https://cf.shopee.vn/file/vn-11134207-7r98o-lzn1mz8a6vyl88", category: "Móc khóa", stock: 80 },
      { name: "Móc Khóa Bánh Croissant", description: "Nhựa dẻo bóp mềm tay (squishy).", price: 30000, image: "https://m.media-amazon.com/images/I/71xT6kXbvjL._AC_UY1000_.jpg", category: "Móc khóa", stock: 90 },
      { name: "Móc Khóa Cung Hoàng Đạo", description: "Inox mạ vàng, khắc biểu tượng cung.", price: 55000, image: "https://media.loveitopcdn.com/6398/thumb/202017-chung-1.jpg", category: "Móc khóa", stock: 120 },
      { name: "Móc Khóa Quả Bơ", description: "Silicone mềm, hình quả bơ má hồng.", price: 25000, image: "https://img.lazcdn.com/g/p/4b5f86e11ada79ecb1369b2be0a4a622.jpg_960x960q80.jpg_.webp", category: "Móc khóa", stock: 200 },
      { name: "Móc Khóa Chân Mèo", description: "Có tiếng kêu 'meo meo' và đèn led.", price: 49000, image: "https://bizweb.dktcdn.net/thumb/grande/100/362/345/products/img-7246-53594185-c812-4613-9c7e-ac285eefa05e.jpg?v=1568496612007", category: "Móc khóa", stock: 70 },
      { name: "Móc Khóa Loopy", description: "Hải ly Loopy biểu cảm hài hước.", price: 59000, image: "https://pos.nvncdn.com/71a8b2-3946/ps/20240121_e7BI1JNjOg.jpeg?v=1705823516", category: "Móc khóa", stock: 40 },
      { name: "Móc Khóa Camera Mini", description: "Nhấn nút có tiếng tách và flash.", price: 65000, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/418/981/products/1-c957bd96-dc14-4fdc-ae1f-03321cc235c3.jpg?v=1745656286037", category: "Móc khóa", stock: 50 },
      { name: "Móc Khóa Đàn Guitar", description: "Kim loại sơn tĩnh điện tinh xảo.", price: 45000, image: "https://media.loveitopcdn.com/41284/kcfinder/upload/images/moc-chia-khoa-hinh-dan-guitar%20%285%29.jpg", category: "Móc khóa", stock: 65 },

      // --- NHÓM STICKER & POSTCARD (Trang trí) ---
      { name: "Set Sticker Vintage 50 Miếng", description: "Chủ đề retro, chống nước tốt.", price: 35000, image: "https://sg-test-11.slatic.net/p/be3a4c63a431f6ba06c1521a9c7d042e.jpg", category: "Sticker", stock: 300 },
      { name: "Sticker Động Vật Mập Mạp", description: "Tấm lớn chứa 20 hình cute.", price: 15000, image: "https://gicungin.com/wp-content/uploads/2025/05/Sticker-Ho-Beo-%E2%80%93-Tron-Trinh-De-Thuong-4.jpg", category: "Sticker", stock: 500 },
      { name: "Postcard Phong Cảnh Đà Lạt", description: "Giấy mỹ thuật 300gsm in sắc nét.", price: 25000, image: "https://gicungin.com/wp-content/uploads/2025/07/poster8-2.jpg", category: "Postcard", stock: 200 },
      { name: "Set Postcard 12 Cung Hoàng Đạo", description: "Mỗi tờ một cung kèm lời chúc.", price: 85000, image: "https://vn-test-11.slatic.net/p/4ee3966ba43c5b62518f1cc5bcc60e3a.jpg", category: "Postcard", stock: 100 },
      { name: "Sticker Hologram Lấp Lánh", description: "Hiệu ứng cầu vồng khi nghiêng.", price: 20000, image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly640wvbjzq952", category: "Sticker", stock: 150 },
      { name: "Sticker Đồ Ăn Việt Nam", description: "Bánh mì, phở, cà phê phin.", price: 18000, image: "https://vn-test-11.slatic.net/p/8c6b2f4ca81cd506519786f747d11600.png", category: "Sticker", stock: 250 },
      { name: "Postcard Thank You", description: "Gửi lời cảm ơn đến người thương.", price: 12000, image: "https://i.pinimg.com/736x/7a/a0/5c/7aa05ca95c91e96f7aafd2a294ccb8e9.jpg", category: "Postcard", stock: 400 },
      { name: "Tấm Gỗ Decor Vẽ Tay", description: "Postcard bằng gỗ mỏng trang trí bàn.", price: 75000, image: "https://static.spacet.vn/image-resized/768x7680_max/img/product/2024-11-15/bo-tranh-treo-13-la-go-ve-tay-tong-nau-cam-trang-tri-mua-he-la-go-decor-nha-cua-tranh-go-la-decor-treo-tuong-14492-0-67370d2d4087d74cc8a84303.webp", category: "Postcard", stock: 30 },
      { name: "Sticker Lettering Truyền Cảm Hứng", description: "Các câu nói hay bằng tiếng Anh.", price: 22000, image: "https://gicungin.com/wp-content/uploads/2025/05/Sticker-Motivation-Trang-Den-3.jpg", category: "Sticker", stock: 180 },
      { name: "Postcard Nhật Ký Du Lịch", description: "Khoảng trống để dán ảnh mini.", price: 30000, image: "https://media.phunumoi.net.vn/files/dieuthuan/2021/07/26/how-to-make-a-diy-travel-journal-or-travel-scrapbook-1703.jpg", category: "Postcard", stock: 120 },

      // --- NHÓM PHỤ KIỆN (Tiện ích & Decor) ---
      { name: "Kẹp Tóc Nơ Đỏ Nhung", description: "Phong cách tiểu thư, màu đỏ đô.", price: 15000, image: "https://pos.nvncdn.com/71e899-15049/ps/20230210_0y8CqdQHRpDqR26i.jpeg?v=1676003432", category: "Phụ kiện", stock: 80 },
      { name: "Bình Nước Aesthetic 1 Lít", description: "Có vạch nhắc giờ uống nước.", price: 75000, image: "https://down-vn.img.susercontent.com/file/904c85fe9b9b21e6b74c7441bbfdbb6e", category: "Phụ kiện", stock: 60 },
      { name: "Túi Tote Vải Canvas Trắng", description: "In hình tối giản, đựng được laptop.", price: 65000, image: "https://vietmadeco.vn/wp-content/uploads/2023/10/Tui-canvas-trang-tron-le-mielleur-vmc1788-1.jpg", category: "Phụ kiện", stock: 90 },
      { name: "Đèn Ngủ Silicon Mèo Con", description: "Cảm ứng đổi 7 màu nhẹ nhàng.", price: 120000, image: "https://img.lazcdn.com/g/p/86fdeb6a8deffac37dc398ded59993f2.jpg_720x720q80.jpg", category: "Phụ kiện", stock: 40 },
      { name: "Vòng Tay Đôi Nam Châm", description: "Gắn kết tình cảm lứa đôi.", price: 55000, image: "https://tnj.vn/31551-large_default/vong-tay-doi-nam-cham-bac-trai-tim-khac-ten-ltd0021.jpg", category: "Phụ kiện", stock: 110 },
      { name: "Set 5 Bút Gel Pastel", description: "Mực đen, ngòi 0.5mm viết êm.", price: 49000, image: "https://product.hstatic.net/1000230347/product/artboard_1_copy_a9e9311d27b549f2be6ad94eaa9c0d6c.jpg", category: "Phụ kiện", stock: 300 },
      { name: "Sổ Tay Planner Bìa Da", description: "Lập kế hoạch công việc hằng ngày.", price: 95000, image: "https://bizweb.dktcdn.net/100/464/700/products/2022-10-25-08-56-img-1885.jpg?v=1701321336450", category: "Phụ kiện", stock: 45 },
      { name: "Kính Mát Thời Trang Gọng Tròn", description: "Chống tia UV, phong cách retro.", price: 135000, image: "https://desmonshop.com/wp-content/uploads/2021/12/photo_2021-12-07_22-03-50.jpg", category: "Phụ kiện", stock: 25 },
      { name: "Tất Cổ Cao Họa Tiết Thổ Cẩm", description: "Chất cotton co giãn thoáng khí.", price: 25000, image: "https://img.lazcdn.com/g/p/cb28e8dadc4434d9c10ef237efa06399.jpg_720x720q80.jpg", category: "Phụ kiện", stock: 200 },
      { name: "Kẹp Sách Kim Loại Mạ Vàng", description: "Hình lá phong, thiết kế tinh xảo.", price: 42000, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/511/102/products/o1cn01jali9c2jn1r42itfh-2209521209465-0-cib-1666708837005.jpg?v=1711079497467", category: "Phụ kiện", stock: 85 },
      { name: "Ốp Lưng iPhone Tai Mèo", description: "Silicone dẻo bảo vệ máy toàn diện.", price: 85000, image: "https://phukieniphone.vn/wp-content/uploads/2023/05/snapedit_1685153753878.png", category: "Phụ kiện", stock: 70 },
      { name: "Băng Đô Rửa Mặt Tai Gấu", description: "Vải bông lông cừu siêu mềm.", price: 35000, image: "https://product.hstatic.net/200000886831/product/20_c190e46068f94090b37b94d79e283115_master.jpg", category: "Phụ kiện", stock: 150 },
      { name: "Khăn Choàng Cổ Len Sọc", description: "Ấm áp cho mùa đông không lạnh.", price: 155000, image: "https://product.hstatic.net/1000111569/product/khan_choang_co_len__19__8218c0d6a3574c4e960a7f3c26ee8fe0_1024x1024.jpg", category: "Phụ kiện", stock: 35 },
      { name: "Túi Đựng Mỹ Phẩm Trong Suốt", description: "Chống nước, khóa kéo chắc chắn.", price: 58000, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/367/937/products/01-05546f80-16fd-4ddd-aeb0-cc0cc085ff20.jpg?v=1652688752663", category: "Phụ kiện", stock: 100 },
      { name: "Giá Đỡ Điện Thoại Gỗ", description: "Hình chú chó nhỏ trang trí bàn làm việc.", price: 45000, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/408/246/products/20-e7fb982f-ed6f-4673-962f-bc3e97774068.jpg?v=1692162849470", category: "Phụ kiện", stock: 60 },
      { name: "Nến Thơm Tinh Dầu Lavender", description: "Thư giãn sau ngày làm việc mệt mỏi.", price: 145000, image: "https://kodo.vn/wp-content/uploads/2023/06/Nen-thom-tinh-dau-nuoc-hoa-Lavender-Woody.png", category: "Phụ kiện", stock: 40 },
      { name: "Chuông Gió Nhật Bản Furin", description: "Thủy tinh vẽ tay, âm thanh thanh khiết.", price: 89000, image: "https://songhantourist.com/upload/articles-images/images/31288093_1968836249824974_1119442221649625088_n.jpg", category: "Phụ kiện", stock: 20 },
      { name: "Bàn Di Chuột Phim Hoạt Hình", description: "Kích thước lớn, bề mặt mịn mượt.", price: 55000, image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lw5l5flg8uzd1f", category: "Phụ kiện", stock: 120 },
      { name: "Đèn Led Dây Trang Trí", description: "Độ dài 5m, dùng cổng USB tiện lợi.", price: 65000, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/320/971/products/led-day-nanoco.jpg?v=1593672033303", category: "Phụ kiện", stock: 150 },
      { name: "Lịch Để Bàn Mini 2026", description: "In hình vẽ tay cute mỗi tháng.", price: 35000, image: "https://annhan.vn/source/SanPham/lich_mini/z6816632191869_3583f4bfb41a349a545d93f64b7b218c.jpg", category: "Phụ kiện", stock: 200 }
    ];

    await Product.insertMany(sampleProducts);
    console.log(`Đã nạp thành công ${sampleProducts.length} sản phẩm với ảnh Unsplash!`);
    process.exit();
  })
  .catch(err => {
    console.error("Lỗi nạp dữ liệu:", err);
    process.exit(1);
  });