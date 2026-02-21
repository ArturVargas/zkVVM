import 'dotenv/config';

const required = [
  'EVVM_SEPOLIA_RPC_URL',
  'EVVM_SEPOLIA_KEY',
  'EVVM_SEPOLIA_CHAIN_ID',
  'EVVM_CORE_ADDRESS',
  'EVVM_STAKING_ADDRESS',
  'ZKVVM_ADMIN_ADDRESS',
  'FISHER_PRIVATE_KEY',
  'VITE_ZKVVM_ADDRESS',
  'VITE_CORE_ADDRESS',
  'VITE_FISHER_URL',
];

const missing = required.filter((key) => !process.env[key] || process.env[key]?.trim() === '');

if (missing.length > 0) {
  const msg = [
    'Missing required environment variables:',
    ...missing.map((key) => `- ${key}`),
    '',
    'Copy .env.example to .env and fill in all values.',
  ].join('\n');
  console.error(msg);
  process.exit(1);
}
