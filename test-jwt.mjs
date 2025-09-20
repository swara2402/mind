import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

// Test data
const payload = {
  userId: '5de34d5c-68d5-4d6f-837c-5c161ab0aebd',
  username: 'testuser123'
};

console.log('Testing JWT token generation...');
console.log('Payload:', payload);
console.log('Secret:', JWT_SECRET);

try {
  // Generate token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  console.log('✅ Token generated successfully!');
  console.log('Generated token:', token);

  // Verify token
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verified successfully!');
  console.log('Decoded payload:', decoded);

} catch (error) {
  console.log('❌ JWT operation failed:');
  console.log('Error name:', error.name);
  console.log('Error message:', error.message);
  console.log('Stack trace:', error.stack);
}
