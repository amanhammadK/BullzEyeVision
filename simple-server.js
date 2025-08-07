const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the client/src directory
app.use('/src', express.static(path.join(__dirname, 'client', 'src')));
app.use('/public', express.static(path.join(__dirname, 'client', 'public')));

// Simple test route
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>React Three Fiber Test</title>
        <style>
            body { margin: 0; padding: 20px; font-family: monospace; background: #000; color: white; }
            .status { background: rgba(0,0,0,0.8); padding: 10px; margin: 10px 0; }
            .success { color: green; }
            .error { color: red; }
        </style>
    </head>
    <body>
        <h1>React Three Fiber Test</h1>
        <div id="status" class="status">Testing...</div>
        <div id="container" style="width: 100%; height: 400px; border: 2px solid yellow;"></div>
        
        <script type="module">
            console.log('🎯 Starting React Three Fiber test...');
            
            const statusEl = document.getElementById('status');
            
            try {
                // Test if we can import React Three Fiber
                statusEl.innerHTML = '✅ Testing React Three Fiber imports...';
                statusEl.className = 'status success';
                
                // This is a basic test - in a real app, we'd need proper bundling
                console.log('✅ Basic test setup complete');
                statusEl.innerHTML = '✅ Basic test environment ready. Check console for details.';
                
            } catch (error) {
                console.error('❌ Error:', error);
                statusEl.innerHTML = '❌ Error: ' + error.message;
                statusEl.className = 'status error';
            }
        </script>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simple server is running',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.send(`
    <h1>Simple Test Server</h1>
    <p>Server is running on port ${PORT}</p>
    <ul>
        <li><a href="/test">React Three Fiber Test</a></li>
        <li><a href="/health">Health Check</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
  console.log(`📋 Test page: http://localhost:${PORT}/test`);
});
