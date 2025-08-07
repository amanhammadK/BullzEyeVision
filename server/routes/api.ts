import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Mock data for demonstration
const mockStockData = [
  { symbol: 'AAPL', price: 185.42, change: 4.23, changePercent: 2.34, signal: 'BUY', confidence: 94, volume: 45234567 },
  { symbol: 'TSLA', price: 248.91, change: -2.15, changePercent: -0.86, signal: 'HOLD', confidence: 67, volume: 32145678 },
  { symbol: 'NVDA', price: 421.33, change: 12.87, changePercent: 3.15, signal: 'BUY', confidence: 89, volume: 28765432 },
  { symbol: 'MSFT', price: 378.12, change: 6.45, changePercent: 1.73, signal: 'BUY', confidence: 82, volume: 19876543 },
  { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85, signal: 'SELL', confidence: 76, volume: 15432109 },
  { symbol: 'AMZN', price: 156.78, change: 3.21, changePercent: 2.09, signal: 'BUY', confidence: 88, volume: 22345678 },
  { symbol: 'META', price: 298.45, change: -5.67, changePercent: -1.86, signal: 'SELL', confidence: 79, volume: 18765432 },
  { symbol: 'NFLX', price: 445.23, change: 8.91, changePercent: 2.04, signal: 'BUY', confidence: 85, volume: 12345678 }
];

const mockAlerts = [
  {
    id: '1',
    symbol: 'AAPL',
    type: 'BUY_SIGNAL',
    message: 'Strong bullish momentum detected across all timeframes',
    confidence: 94,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    targetPrice: 195.50,
    stopLoss: 180.25
  },
  {
    id: '2',
    symbol: 'NVDA',
    type: 'BREAKOUT',
    message: 'Price breaking above key resistance level',
    confidence: 89,
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    targetPrice: 445.00,
    stopLoss: 410.00
  },
  {
    id: '3',
    symbol: 'MSFT',
    type: 'VOLUME_SPIKE',
    message: 'Unusual volume spike with bullish price action',
    confidence: 82,
    timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
    targetPrice: 390.00,
    stopLoss: 370.00
  }
];

const mockUserStats = {
  totalTrades: 247,
  winRate: 72.5,
  totalProfit: 2456789.45,
  avgHoldTime: '2.3 hours',
  bestTrade: 15678.90,
  currentStreak: 8,
  alertsReceived: 1234,
  alertsActedOn: 892
};

// GET /api/stocks - Get current stock data with signals
router.get('/stocks', (req: Request, res: Response) => {
  try {
    // Simulate real-time price updates
    const updatedStocks = mockStockData.map(stock => ({
      ...stock,
      price: stock.price + (Math.random() - 0.5) * 2,
      change: stock.change + (Math.random() - 0.5) * 0.5,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 0.2,
      confidence: Math.max(60, Math.min(99, stock.confidence + (Math.random() - 0.5) * 5)),
      lastUpdated: new Date()
    }));

    res.json({
      success: true,
      data: updatedStocks,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data'
    });
  }
});

// GET /api/alerts - Get recent trading alerts
router.get('/alerts', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const alerts = mockAlerts.slice(0, limit);

    res.json({
      success: true,
      data: alerts,
      total: mockAlerts.length,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts'
    });
  }
});

// GET /api/stats - Get user trading statistics
router.get('/stats', (req: Request, res: Response) => {
  try {
    // Simulate slight variations in stats
    const stats = {
      ...mockUserStats,
      winRate: mockUserStats.winRate + (Math.random() - 0.5) * 2,
      totalProfit: mockUserStats.totalProfit + (Math.random() - 0.5) * 10000,
      currentStreak: mockUserStats.currentStreak + Math.floor(Math.random() * 3) - 1
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// POST /api/subscribe - Subscribe to email alerts
router.post('/subscribe', (req: Request, res: Response) => {
  try {
    const { email, traderType } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      });
    }

    // In a real app, you'd save this to a database
    console.log(`New subscription: ${email} (${traderType})`);

    res.json({
      success: true,
      message: 'Successfully subscribed to BullzEye alerts',
      data: {
        email,
        traderType,
        subscribedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process subscription'
    });
  }
});

// GET /api/market-status - Get current market status
router.get('/market-status', (req: Request, res: Response) => {
  try {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    let status = 'CLOSED';
    let nextOpen = 'Monday 9:30 AM EST';

    // Simple market hours logic (EST)
    if (day >= 1 && day <= 5) { // Monday to Friday
      if (hour >= 4 && hour < 9.5) {
        status = 'PRE_MARKET';
        nextOpen = 'Today 9:30 AM EST';
      } else if (hour >= 9.5 && hour < 16) {
        status = 'OPEN';
        nextOpen = 'Tomorrow 9:30 AM EST';
      } else if (hour >= 16 && hour < 20) {
        status = 'AFTER_HOURS';
        nextOpen = 'Tomorrow 9:30 AM EST';
      }
    }

    res.json({
      success: true,
      data: {
        status,
        nextOpen,
        currentTime: now,
        timezone: 'EST',
        isWeekend: day === 0 || day === 6
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market status'
    });
  }
});

// GET /api/health - Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

export default router;
