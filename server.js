// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';
// import chatRoutes from './routes/chat.js';
// import cookieParser from "cookie-parser";


// app.use(cookieParser());

// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();

// // Middleware
// // app.use(cors());
// app.use(
//   cors({
//     origin: [
//       "https://margdarshi-frontend.vercel.app", // apna actual frontend URL
//       "http://localhost:5173" // local dev
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://malviyakunal90_db_user:eN7QtOhttsPHscH1@cluster0.dfx70l2.mongodb.net/?appName=Cluster0', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log('✅ MongoDB connected successfully');
//     } catch (error) {
//         console.error('❌ MongoDB connection error:', error.message);
//         process.exit(1);
//     }
// };

// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/chat', chatRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//     res.json({
//         success: true,
//         message: 'Margdarshi server is running',
//         timestamp: new Date().toISOString()
//     });
// });

// // Root endpoint
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Welcome to Margdarshi API - Bhagavad Gita AI Guidance',
//         version: '1.0.0',
//         endpoints: {
//             auth: {
//                 register: 'POST /api/auth/register',
//                 login: 'POST /api/auth/login'
//             },
//             chat: {
//                 geeta: 'POST /api/chat/geeta (requires authentication)'
//             }
//         }
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Endpoint not found'
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error('Server error:', err);
//     res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Margdarshi server running on port ${PORT}`);
//     console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
// });

// export default app;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
 
// Load environment variables
dotenv.config();

// ✅ CREATE APP (MOST IMPORTANT)
const app = express();

// ✅ MIDDLEWARE
app.use(
  cors({
    origin: [
      'https://margdarshi-frontend.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Margdarshi server running on port ${PORT}`);
});
