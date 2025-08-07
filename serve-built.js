const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  console.log(`📥 ${req.method} ${req.url}`);
  
  // Handle root path
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Remove query parameters
  filePath = filePath.split('?')[0];
  
  // Security: prevent directory traversal
  if (filePath.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  const fullPath = path.join(DIST_DIR, filePath);
  
  // Check if file exists
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`❌ File not found: ${fullPath}`);
      
      // For SPA routing, serve index.html for non-asset requests
      if (!filePath.startsWith('/assets/') && !path.extname(filePath)) {
        const indexPath = path.join(DIST_DIR, 'index.html');
        fs.readFile(indexPath, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
        return;
      }
      
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    // Read and serve the file
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        console.log(`❌ Error reading file: ${err.message}`);
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      
      const mimeType = getMimeType(fullPath);
      console.log(`✅ Serving: ${filePath} (${mimeType})`);
      
      res.writeHead(200, { 
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Built app server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${DIST_DIR}`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
  console.log(`🧪 Test page: http://localhost:${PORT}/test`);
  
  // List available files
  console.log('\n📋 Available files:');
  try {
    const files = fs.readdirSync(DIST_DIR, { recursive: true });
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  } catch (err) {
    console.log('   Could not list files:', err.message);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.log(`❌ Server error:`, err.message);
  }
});
