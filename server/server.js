const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./Routes/userRoutes");
const dotenv = require("dotenv");
const pool = require("./config/db");
const authUser = require("./controller/authUser");
const groupChatRoutes = require("./Routes/chatRoutes");
const adminRoutes = require("./Routes/adminRoutes");
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type","Authorization"],
		credentials: true,
	},
});

app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type","Authorization"],
		credentials: true,
	})
);
app.use(express.json());

// Catch JSON parse errors from express.json and return JSON error instead of HTML
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
		console.error('JSON parse error:', err.message);
		return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
	}
	next();
});

// Simple health endpoint to verify server + DB connectivity
app.get('/health', async (req, res) => {
	try {
		const result = await pool.query('SELECT 1');
		return res.json({ ok: true, db: result.rows[0] });
	} catch (err) {
		console.error('Health check DB error:', err.message || err);
		return res.status(500).json({ ok: false, error: err.message });
	}
});

app.use((req, res, next) => {
	req.io = io;
	next();
});
// console.log(process.env.FRONTEND_URL);
app.use("/api/user", userRoutes);
app.use("/api/groupChat", groupChatRoutes);
app.use("/api/admin", adminRoutes);

io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);
	socket.on("joinCourse", (courseId) => {
		socket.join(courseId);
		console.log(`User joined course room: ${courseId}`);
	});

	socket.on("sendMessage", (messageData) => {
		const { content, senderId, courseId } = messageData;
		io.to(courseId).emit("messageReceived", messageData);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
