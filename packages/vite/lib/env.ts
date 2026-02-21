type RequiredViteEnvKey = 'VITE_ZKVVM_ADDRESS' | 'VITE_CORE_ADDRESS' | 'VITE_FISHER_URL';

export function getRequiredViteEnv(key: RequiredViteEnvKey) {
  const value = import.meta.env[key];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required env var: ${key}. Set it in the repo root .env (vite.envDir).`,
    );
  }
  return value;
}
