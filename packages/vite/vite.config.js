import react from '@vitejs/plugin-react-swc';

export default {
  envDir: '../../',
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
    exclude: ['@noir-lang/acvm_js', '@noir-lang/noirc_abi', '@noir-lang/noir_js'],
    include: ['@noir-lang/types'],
  },
  plugins: [
    react({
      tsDecorators: true,
    }),
  ],
};
