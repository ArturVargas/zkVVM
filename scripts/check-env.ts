import 'dotenv/config';

const requiredByScope: Record<string, string[]> = {
  deploy: [
    'EVVM_SEPOLIA_RPC_URL',
    'EVVM_SEPOLIA_KEY',
    'EVVM_CORE_ADDRESS',
    'EVVM_STAKING_ADDRESS',
    'ZKVVM_ADMIN_ADDRESS',
  ],
  fisher: [
    'EVVM_SEPOLIA_RPC_URL',
    'EVVM_SEPOLIA_CHAIN_ID',
    'FISHER_PRIVATE_KEY',
  ],
  vite: ['VITE_ZKVVM_ADDRESS', 'VITE_CORE_ADDRESS', 'VITE_FISHER_URL'],
};

const scope = process.argv[2] || 'all';
const allKeys = Array.from(
  new Set(Object.values(requiredByScope).flat()),
).sort();
const required = scope === 'all' ? allKeys : requiredByScope[scope];

if (!required) {
  const msg = [
    'Unknown scope for env check.',
    'Usage: bun run scripts/check-env.ts [deploy|fisher|vite|all]',
  ].join('\n');
  console.error(msg);
  process.exit(1);
}

const missing = required.filter((key) => !process.env[key] || process.env[key]?.trim() === '');

if (missing.length > 0) {
  const msg = [
    `Missing required environment variables (scope: ${scope}):`,
    ...missing.map((key) => `- ${key}`),
    '',
    'Copy .env.example to .env and fill in all values.',
  ].join('\n');
  console.error(msg);
  process.exit(1);
}
