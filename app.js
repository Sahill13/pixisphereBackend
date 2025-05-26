const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { morganLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');
const limiter = require('./middlewares/rateLimiter');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const partnerRoutes = require('./routes/partner');
const portfolioRoutes = require('./routes/portfolio');
const inquiryRoutes = require('./routes/inquiry');
const adminRoutes = require('./routes/admin');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
app.use(morganLogger(process.env.NODE_ENV));

// Rate limiting
app.use('/api', limiter);

// Mount Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/partner/portfolio', portfolioRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pixisphere API is running',
    docs: '/api-docs'
  });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;