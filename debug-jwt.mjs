import jwt from 'jsonwebtoken';

// Test token from login response
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGUzNGQ1Yy02OGQ1LTRkNmYtODM3Yy01YzE2MWFiMGFlYmQiLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwiaWF0IjoxNzU4MzM4NDE3LCJleHAiOjE3NTgzNDIwMTd9.sCc7tfhWMmI0KBn6QQgbnG0-YaNdEClv7sBqmfmJ_1rMM';

const JWT_SECRET = 'your-secret-key';

console.log('Testing JWT token...');
console.log('Token:', testToken);
console.log('Secret:', JWT_SECRET);

try {
  const decoded = jwt.verify(testToken, JWT_SECRET);
  console.log('✅ Token is valid!');
  console.log('Decoded payload:', decoded);
} catch (error) {
  console.log('❌ Token verification failed:');
  console.log('Error name:', error.name);
  console.log('Error message:', error.message);

  // Try to decode without verification to see the payload
  try {
    const decodedWithoutVerify = jwt.decode(testToken);
    console.log('Payload (without verification):', decodedWithoutVerify);
  } catch (decodeError) {
    console.log('Could not decode token:', decodeError.message);
  }
}
