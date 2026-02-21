# Comparación: Main vs EVVM-Integration

## Resumen Ejecutivo

Este documento compara las dos ramas principales del proyecto zkVVM para facilitar decisiones de integración y migración.

| Aspecto | `main` | `feat/evvm-integration` |
|---------|---------|-------------------------|
| **Estado** | ✅ Funcional, desplegado | ⚠️ Funcional con gaps |
| **Arquitectura** | Standalone Pool | EVVM Service |
| **Gas Model** | Usuario paga | Gasless (Fisher) |
| **Commits** | Baseline | +32 commits |
| **Archivos Cambiados** | - | 70 files: +35.7K/-1.5K líneas |
| **Contratos Desplegados** | Sepolia | Sepolia EVVM |

---

## 1. Contratos Inteligentes

### Main Branch

**ShieldedPool.sol** (Dirección: `0x0f86796c3f3254442debd0705a56bdd82c69f4a6`)
- ✅ Contrato standalone tradicional
- ✅ ERC20 transfers directos (USDC: `0xd9aee9351f7685b05a6b7bd8c1ca509d24be1e57`)
- ✅ UltraVerifier real desplegado (`0xf62e5a932a832c8ea990dedd87a05162c8905224`)
- ✅ Merkle root registration manual
- ✅ Usuario paga gas directamente
- ⚠️ No EVVM integration

**Funciones principales:**
```solidity
function deposit(address from, bytes32 commitment, uint256 amount)
function withdraw(address to, bytes calldata proof, bytes32[] calldata publicInputs)
function registerRoot(bytes32 root) onlyOwner
```

### EVVM-Integration Branch

**zkVVM.sol** (Dirección: `0x37b4879e0a06323cc429307883d1d73e08c78059`)
- 🆕 Hereda de `EvvmService` - integración nativa con EVVM Core
- 🆕 Dual signature validation (zkVVM nonce + EVVM pay nonce)
- 🆕 Gasless deposits/withdrawals via Fisher
- 🆕 Root auto-actualizada en cada deposit
- ⚠️ MockVerifier (`0x7f211f541ff66a37b51d48c96edbb2a54a109b23`) - acepta cualquier proof
- ❌ UltraVerifier real no desplegado todavía

**Funciones principales:**
```solidity
function deposit(
    address user,
    bytes memory commitment,
    uint256 amount,
    address originExecutor,
    uint256 nonce,
    bytes calldata signature,
    uint256 priorityFeePay,
    uint256 noncePay,
    bytes calldata signaturePay,
    bytes32 expectedNextRoot
) external payable returns (bytes32)

function withdraw(
    address user,
    address recipient,
    bytes calldata proof,
    bytes32 expectedRoot,
    bytes32[] calldata publicInputs,
    bytes calldata ciphertext,
    address originExecutor,
    uint256 nonce,
    bytes calldata signature
) external payable returns (bool)
```

**Diferencias Clave:**
- ✅ Doble validación de nonce previene replay attacks en ambos contextos
- ✅ `originExecutor`: permite especificar quién ejecutará (Fisher)
- ✅ `ciphertext`: monto cifrado para privacy adicional
- ✅ `expectedNextRoot`: validación de merkle tree state
- ⚠️ Más complejidad = mayor superficie de ataque

---

## 2. Circuitos Noir

### Main Branch

**Versión Noir:** `1.0.0-beta.0`

**Circuitos Compilados:**
- `note_generator.nr` → Genera bearer token (nullifier, commitment, entry, root)
- `withdraw.nr` → Proof de retiro con Merkle tree validation
- Artifacts individuales por circuito
- UltraVerifier generado y desplegado

### EVVM-Integration Branch

**Versión Noir:** `1.0.0-beta.18` (⚠️ BREAKING CHANGE)

**Circuitos Disponibles:**
- `note_generator.nr` - ⚠️ No compilado individualmente
- `withdraw.nr` - ✅ Compilado como `noirstarter.json` (main circuit)
- `simple.nr` - Testing circuit
- `split.nr` - 🆕 Divide 1 nota en 4 notas (bearer note splitting)

**Artifact Generado:**
- `packages/noir/target/noirstarter.json` (597 KB)
- Solo UN artifact (circuito principal = withdraw)
- ⚠️ Tests esperan artifacts individuales (gap identificado)

**Diferencias API (beta.0 vs beta.18):**
- `@noir-lang/acvm_js`: Cambios en API de witness generation
- `@noir-lang/noir_js`: Cambios en formato de inputs/outputs
- `@noir-lang/noirc_abi`: Encoding/decoding actualizado
- ⚠️ Proofs generados con beta.0 NO son verificables por beta.18

---

## 3. Frontend

### Main Branch

**Ubicación:** `apps/frontend/`

**Tecnologías:**
- Vite + React
- Wagmi 2.x para wallet connection
- Viem 2.x para blockchain interactions
- Noir beta.0 WASM modules

**Hooks Disponibles:**
- `useDeposit`: Deposit directo a ShieldedPool.sol
- `useWithdraw`: Genera proof y retira
- Llamadas directas a contratos via viem
- Usuario paga gas

**Flujo:**
```
Usuario → Frontend → ShieldedPool.sol → Blockchain
         ↓ (paga gas)
```

### EVVM-Integration Branch

**Ubicación:** `packages/vite/`

**Tecnologías:**
- Vite + React
- Wagmi 2.x
- Viem 2.x
- Noir beta.18 WASM modules
- `@evvm/evvm-js` ^0.1.20

**Hooks Nuevos:**
- `useEvvm`: Crea signer EVVM-compatible
- `useZK`: Genera notas + proofs ZK (actualizado para beta.18)

**Servicios Nuevos:**
- `zkVVM.ts`: Extiende `BaseService`, construye SignedActions
- `ZKService.ts`: Wrapper para circuitos Noir

**Páginas:**
- `DashboardPage.tsx`: Mint bearer tokens, deposit
- `WithdrawPage.tsx`: Withdraw con ZK proof
- `LandingPage.tsx`: Marketing page

**Flujo Gasless:**
```
Usuario → Frontend → Fisher (localhost:8787) → zkVVM.sol → Blockchain
         ↓ (firma, 0 gas)       ↓ (ejecuta, paga gas)
```

---

## 4. Fisher Relayer

### Main Branch

❌ **No existe**

### EVVM-Integration Branch

**Ubicación:** `fisher/`

**Función:**
- HTTP server (Bun) en puerto 8787
- Endpoint: `POST /execute`
- Recibe `SignedAction` del frontend
- Ejecuta transacción on-chain
- Paga gas en nombre del usuario

**Dependencias:**
```json
{
  "@evvm/evvm-js": "^0.1.20",
  "viem": "2.x"
}
```

**Beneficios:**
- ✅ Gasless UX para usuarios
- ✅ Fisher gana recompensas MATE (EVVM incentives)
- ✅ Usuarios solo firman mensajes (EIP-191)

**Riesgos:**
- ⚠️ Centralización: Si Fisher cae, no hay transacciones
- ⚠️ Requiere Fisher honesto (puede censurar txs)
- ⚠️ Latencia adicional vs direct execution

---

## 5. Deployment Configuration

### Main Branch

**Deployment File:** `contracts/deployments/pool-deployment.json`

```json
{
  "poolAddress": "0x0f86796c3f3254442debd0705a56bdd82c69f4a6",
  "usdcAddress": "0xd9aee9351f7685b05a6b7bd8c1ca509d24be1e57",
  "verifierAddress": "0xcdc6ade9d348572f302690bd39ba8120f8e91db3",
  "withdrawVerifierAddress": "0xf62e5a932a832c8ea990dedd87a05162c8905224"
}
```

**Red:** Sepolia (ChainID: 11155111)

### EVVM-Integration Branch

**Deployment File:** `deployments/sepolia_evvm/addresses.json`

```json
{
  "network": "sepolia_evvm",
  "chainId": 11155111,
  "evvm": {
    "core": "0xFA56B6992c880393e3bef99e41e15D0C07803BC1",
    "staking": "0x805F35c5144FeBb5AA49Dbc785634060341A0a5D"
  },
  "admin": "0x15FF236ecD89b34a527112F7f51d6215609df409",
  "verifier": {
    "mock": "0x7f211f541ff66a37b51d48c96edbb2a54a109b23",
    "real": ""
  },
  "zkVVM": {
    "address": "0x37b4879e0a06323cc429307883d1d73e08c78059",
    "withdrawVerifier": "0x7f211f541ff66a37b51d48c96edbb2a54a109b23"
  }
}
```

**Red:** Sepolia EVVM (ChainID: 11155111, con EVVM Core)

---

## 6. Variables de Entorno

### Main Branch

**Mínimas:**
```
VITE_POOL_ADDRESS=0x0f86796c3f3254442debd0705a56bdd82c69f4a6
VITE_PRIVATE_KEY=...
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

### EVVM-Integration Branch

**Completas (13 variables):**
```
# Deployment
EVVM_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
EVVM_SEPOLIA_KEY=...
EVVM_SEPOLIA_CHAIN_ID=11155111

# EVVM Core
EVVM_CORE_ADDRESS=0xFA56B6992c880393e3bef99e41e15D0C07803BC1
EVVM_STAKING_ADDRESS=0x805F35c5144FeBb5AA49Dbc785634060341A0a5D

# zkVVM
ZKVVM_ADMIN_ADDRESS=0x15FF236ecD89b34a527112F7f51d6215609df409
WITHDRAW_VERIFIER_ADDRESS=0x7f211f541ff66a37b51d48c96edbb2a54a109b23

# Fisher
FISHER_PRIVATE_KEY=...
FISHER_PORT=8787

# Frontend
VITE_ZKVVM_ADDRESS=0x37b4879e0a06323cc429307883d1d73e08c78059
VITE_CORE_ADDRESS=0xFA56B6992c880393e3bef99e41e15D0C07803BC1
VITE_FISHER_URL=http://localhost:8787
```

---

## 7. Scripts de Validación

### Main Branch

❌ No existen scripts de validación de env

### EVVM-Integration Branch

**Script:** `scripts/check-env.ts`

**Comandos:**
- `bun run check:env:vite` - Valida vars del frontend
- `bun run check:env:fisher` - Valida vars de Fisher
- `bun run check:env:deploy` - Valida vars de deployment

✅ Previene errores de configuración antes de ejecutar

---

## 8. Tests Unitarios

### Main Branch

**Tests:**
- `tests/shielded-pool.test.ts` - Tests de ShieldedPool.sol
- Circuitos beta.0
- ✅ Tests pasan

### EVVM-Integration Branch

**Tests:**
- `tests/up.test.ts` - ❌ Falla (busca artifacts individuales)
- `tests/service.test.ts` - ❌ Falla (busca artifacts individuales)
- `tests/uh.test.ts` - ❌ Eliminado

**Gap Crítico:**
Tests esperan:
```
- note_generator.json
- withdraw.json
- commitment_helper.json
- nullifier_helper.json
- root_helper.json
```

Pero solo existe: `noirstarter.json`

**Acción Requerida:**
- [ ] Refactorizar tests para usar `noirstarter.json`, o
- [ ] Configurar Nargo workspaces para compilar circuitos individuales

---

## 9. Dependencias Críticas

### Comunes

```json
{
  "viem": "2.46.2",
  "wagmi": "2.10.0",
  "hardhat": "2.19.2"
}
```

### Main Branch

```json
{
  "@noir-lang/*": "1.0.0-beta.0",
  "@aztec/bb.js": "0.63.1"
}
```

### EVVM-Integration Branch

```json
{
  "@noir-lang/*": "1.0.0-beta.18",
  "@aztec/bb.js": "2.1.11",
  "@evvm/testnet-contracts": "3.0.1",
  "@evvm/evvm-js": "0.1.20"
}
```

---

## 10. Qué se PIERDE al migrar a EVVM-Integration

### Contratos
- ❌ ShieldedPool.sol (standalone) - reemplazado por zkVVM.sol
- ❌ UltraVerifier real - reemplazado temporalmente por MockVerifier
- ❌ Deployment en Sepolia original

### Compatibilidad
- ❌ Notas generadas con beta.0 NO funcionan con beta.18
- ❌ Proofs de beta.0 NO verificables por beta.18
- ❌ Usuarios con fondos en ShieldedPool quedan sin acceso

### Tests
- ❌ Suite de tests completa rota
- ❌ Cobertura de testing degradada

---

## 11. Qué se GANA con EVVM-Integration

### UX
- ✅ **Gasless transactions** - Usuarios no pagan gas
- ✅ Firma EIP-191 simple (no broadcast de txs)
- ✅ Fisher maneja complejidad de blockchain

### Arquitectura
- ✅ Integración nativa con EVVM protocol
- ✅ Dual nonce security (zkVVM + EVVM)
- ✅ Root auto-update en deposits
- ✅ Recompensas MATE para Fishers

### Circuitos
- ✅ Noir beta.18 (más moderno, mejor API)
- ✅ Split notes circuit (divide 1 nota en 4)
- ✅ @aztec/bb.js 2.x (mejor performance)

### Developer Experience
- ✅ Scripts de validación de env
- ✅ Deployment scripts documentados
- ✅ Mejor estructura de mono-repo

---

## 12. Roadmap de Integración

### Opción A: Merge Total (RECOMENDADO)

**Pros:**
- Código unificado
- EVVM es el futuro del proyecto
- Gasless UX es mejor

**Cons:**
- Usuarios con notas en main quedan bloqueados
- Requiere migración forzada

**Pasos:**
1. ⚠️ Anunciar deprecación de ShieldedPool (main)
2. Dar plazo de migración (ej: 30 días)
3. Deploy UltraVerifier real en evvm-integration
4. Testing exhaustivo con verifier real
5. Merge evvm-integration → main
6. Actualizar docs y comunicación

### Opción B: Ramas Paralelas

**Pros:**
- Usuarios de main no afectados
- Transición gradual
- Menor riesgo

**Cons:**
- Duplicación de esfuerzo de mantenimiento
- Confusión para nuevos usuarios
- Fragmentación de comunidad

**Pasos:**
1. Mantener main como "legacy"
2. Promocionar evvm-integration como "nuevo"
3. Documentar diferencias claramente
4. Gradualmente deprecar main

### Opción C: Nueva Rama Production

**Pros:**
- Separación clara dev vs prod
- Main y evvm-integration siguen como dev branches
- Flexibilidad máxima

**Cons:**
- Complejidad de 3 ramas
- Overhead de merges

**Pasos:**
1. Crear rama `production` desde evvm-integration
2. Cerrar gaps críticos (UltraVerifier, tests)
3. Main → experimentos
4. EVVM-integration → features
5. Production → deployments estables

---

## 13. Gaps Críticos Identificados

### Alta Prioridad

- [ ] **MockVerifier → UltraVerifier**
  - Actualmente acepta cualquier proof (inseguro)
  - Necesario: Compilar y deploy verifier real
  - Script disponible: `scripts/deploy-ultra-verifier.js`

- [ ] **Tests Rotos**
  - Todos los tests fallan por artifacts faltantes
  - Requiere refactor o Nargo workspaces

- [ ] **Fisher Público**
  - Actualmente: localhost:8787
  - Necesario: Servidor público con uptime garantizado
  - Considerar: Múltiples Fishers (descentralización)

### Media Prioridad

- [ ] **Migración de Notas**
  - Usuarios en main con notas beta.0
  - Tool de conversión o instrucciones de withdraw

- [ ] **Documentación E2E**
  - Flujos de deposit/withdraw documentados
  - Screenshots/videos de UI
  - Troubleshooting guide

### Baja Prioridad

- [ ] **Circuito Split Notes**
  - Compilado pero no integrado en UI
  - Feature opcional

- [ ] **Hardhat Config Unificado**
  - Soportar ambas redes (sepolia + sepoliaEvvm)

---

## 14. Recomendación Final

**ADOPTAR EVVM-INTEGRATION como nueva baseline** con las siguientes condiciones:

### Antes de Producción:

1. ✅ Deploy UltraVerifier real
2. ✅ Refactorizar tests para beta.18
3. ✅ Testing exhaustivo end-to-end
4. ✅ Fisher en servidor público
5. ✅ Documentación de migración para usuarios de main

### Estrategia de Transición:

- **Semana 1-2:** Deploy UltraVerifier, fix tests
- **Semana 3:** Testing exhaustivo en Sepolia EVVM
- **Semana 4:** Anuncio de deprecación de main
- **Semana 5-6:** Período de migración (usuarios retiran de ShieldedPool)
- **Semana 7:** Merge evvm-integration → main
- **Semana 8+:** Main es la rama EVVM

### Métricas de Éxito:

- ✅ 100% de fondos migrados de ShieldedPool
- ✅ 0 tests fallando
- ✅ Fisher uptime > 99%
- ✅ UltraVerifier verificando proofs correctamente
- ✅ < 3 segundos tiempo de transacción via Fisher

---

## Conclusión

**EVVM-Integration representa una evolución arquitectural significativa** del proyecto zkVVM. Aunque introduce complejidad adicional y requiere resolver gaps críticos, los beneficios de gasless UX y integración EVVM justifican la migración.

**Acción Inmediata:** Completar las tareas de alta prioridad antes de cualquier merge o deployment en producción.

**Timeline Sugerido:** 6-8 semanas para migración completa y segura.
