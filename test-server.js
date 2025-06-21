const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n=== ${description} ===`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        console.log(`Body:`, data.substring(0, 200) + (data.length > 200 ? '...' : ''));
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      console.log(`\n=== ${description} - ERROR ===`);
      console.log(`Error:`, err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing server endpoints...');
  
  try {
    await testEndpoint('/health', 'Health Check');
    await testEndpoint('/test', 'Test Endpoint');
    await testEndpoint('/', 'Main Page');
    console.log('\n✅ All tests completed');
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
  }
}

runTests();