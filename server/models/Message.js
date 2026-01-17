const messageSchema = new mongoose.Schema({
  senderId: String, // ID của khách hoặc Session ID
  senderName: String,
  content: String,
  role: { type: String, enum: ['user', 'bot', 'admin'] },
  createdAt: { type: Date, default: Date.now }
});