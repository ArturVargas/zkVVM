# Production Gaps - zkVVM EVVM-Integration

**Fecha de Análisis:** 21 de Febrero, 2026
**Rama Analizada:** `feat/evvm-integration`
**Estado General:** ⚠️ No production-ready (gaps críticos identificados)

---

## Resumen Ejecutivo

| Categoría | Gaps Críticos | Gaps Menores | Total |
|-----------|---------------|--------------|-------|
| **Seguridad** | 1 | 0 | 1 |
| **Testing** | 2 | 1 | 3 |
| **Infraestructura** | 1 | 2 | 3 |
| **Documentación** | 0 | 3 | 3 |
| **TOTAL** | 4 | 6 | 10 |

**Tiempo Estimado para Resolver Críticos:** 2-3 semanas
**Tiempo Total para Production:** 6-8 semanas

---

## CRÍTICO 🔴 - Bloqueadores de Producción

### 1. MockVerifier Acepta Cualquier Proof (SEGURIDAD)

**Severidad:** 🔴 CRÍTICO
**Impacto:** Cualquiera puede crear pruebas inválidas y retirar fondos
**Prioridad:** P0 - Resolver ANTES de producción

**Descripción:**

Actualmente, `zkVVM.sol` usa `MockVerifier.sol` que siempre retorna `true`:

```solidity
// packages/contracts/MockVerifier.sol
function verify(bytes calldata, bytes32[] calldata) external pure override returns (bool) {
    return true;  // ⚠️ INSEGURO
}
```

**Deployment Actual:**
- MockVerifier: `0x7f211f541ff66a37b51d48c96edbb2a54a109b23`
- zkVVM.withdrawVerifier: `0x7f211f541ff66a37b51d48c96edbb2a54a109b23` (⚠️ Es el Mock!)

**Impacto Financiero:**
- Fondos en zkVVM pueden ser drenados por atacante
- No hay validación de proofs ZK
- Privacy completamente rota

**Solución:**

1. **Compilar UltraVerifier Real:**
   ```bash
   cd packages/noir
   nargo compile withdraw
   bb write_vk -b ./target/noirstarter.json
   bb contract
   ```

2. **Deploy UltraVerifier:**
   ```bash
   bun run scripts/deploy-ultra-verifier.js --network sepoliaEvvm
   ```

3. **Actualizar zkVVM:**
   - Llamar `zkVVM.updateWithdrawVerifier(newVerifierAddress)` (asumiendo que existe)
   - O redesplegar zkVVM con verifier correcto

4. **Testing Exhaustivo:**
   - Probar withdrawals con proofs válidos
   - Intentar withdraw con proof inválido (debe fallar)
   - Validar gas costs

**Scripts Disponibles:**
- ✅ `scripts/deploy-ultra-verifier.js` (ya existe)

**Tiempo Estimado:** 3-5 días (incluye testing)

**Owner:** Security/Smart Contracts Team

---

### 2. Tests Unitarios Completamente Rotos (TESTING)

**Severidad:** 🔴 CRÍTICO
**Impacto:** Imposible validar cambios, riesgo de regressions
**Prioridad:** P0 - Resolver antes de producción

**Descripción:**

Todos los tests fallan con el mismo error:

```bash
error: Cannot find module '../packages/noir/target/note_generator.json'
error: Cannot find module '../packages/noir/target/withdraw.json'
error: Cannot find module '../packages/noir/target/commitment_helper.json'
...
```

**Tests Afectados:**
- ❌ `tests/up.test.ts` - Tests de circuitos
- ❌ `tests/service.test.ts` - Tests de ZKService
- ❌ `tests/uh.test.ts` - Eliminado

**Root Cause:**

Tests esperan artifacts individuales, pero `nargo compile` genera solo `noirstarter.json`.

**Opciones de Solución:**

**Opción A: Nargo Workspaces (RECOMENDADO)**
- Crear múltiples `Nargo.toml` para cada circuito
- Estructura:
  ```
  packages/noir/
  ├── note_generator/
  │   ├── Nargo.toml
  │   └── src/main.nr
  ├── withdraw/
  │   ├── Nargo.toml
  │   └── src/main.nr
  ├── commitment_helper/
  │   ├── Nargo.toml
  │   └── src/main.nr
  ...
  ```
- Compilar cada uno: `nargo compile --package note_generator`

**Opción B: Refactorizar Tests**
- Usar solo `noirstarter.json` (withdraw circuit)
- Eliminar helpers individuales
- Implementar helpers en TypeScript

**Opción C: Frontend Compilation**
- Compilar circuitos en runtime desde frontend (lento)
- No recomendado para testing

**Recomendación:** Opción A - Workspaces

**Tiempo Estimado:** 1 semana (refactor + testing)

**Owner:** Testing/Circuit Team

---

### 3. Fisher Relayer en Localhost (INFRAESTRUCTURA)

**Severidad:** 🔴 CRÍTICO
**Impacto:** Usuarios no pueden hacer transacciones en producción
**Prioridad:** P0 - Necesario para launch

**Descripción:**

Fisher actualmente corre en `localhost:8787`:

```bash
# .env
VITE_FISHER_URL=http://localhost:8787  # ⚠️ Solo desarrollo
```

**Problemas:**
- ❌ No accesible desde internet
- ❌ No hay redundancia (single point of failure)
- ❌ No hay monitoreo
- ❌ No hay rate limiting

**Requerimientos de Producción:**

1. **Hosting:**
   - Server público (DigitalOcean, AWS, Railway, etc.)
   - HTTPS endpoint
   - URL: `https://fisher.zkvvm.network/execute` (ejemplo)

2. **Alta Disponibilidad:**
   - Load balancer con múltiples Fishers
   - Healthcheck endpoint: `GET /health`
   - Auto-restart on failure

3. **Seguridad:**
   - Rate limiting (ej: 10 req/min por IP)
   - CORS configurado correctamente
   - DDoS protection (Cloudflare)
   - Private key en secrets manager (no .env)

4. **Monitoreo:**
   - Uptime monitoring (UptimeRobot, Pingdom)
   - Log aggregation (Datadog, Logtail)
   - Alertas cuando Fisher offline
   - Métricas: txs/día, gas usado, errores

5. **Económicas:**
   - Wallet Fisher con fondos suficientes para gas
   - Auto-top up cuando balance < threshold
   - Dashboard para tracking de gastos

**Arquitectura Sugerida:**

```
Internet
    ↓
Cloudflare (DDoS + HTTPS)
    ↓
Load Balancer (DigitalOcean/AWS)
    ↓
┌─────────┬─────────┬─────────┐
│Fisher #1│Fisher #2│Fisher #3│
└─────────┴─────────┴─────────┘
    ↓           ↓           ↓
  Sepolia EVVM RPC (Infura/Alchemy)
```

**Costo Estimado:**
- Server: $20-50/mes (DigitalOcean droplet)
- Cloudflare: Free tier
- Gas costs: Variable (depende de volumen)

**Tiempo Estimado:** 1-2 semanas (setup + testing)

**Owner:** Infrastructure/DevOps Team

---

### 4. No E2E Testing en Testnet (TESTING)

**Severidad:** 🔴 CRÍTICO
**Impacto:** No sabemos si el sistema funciona end-to-end
**Prioridad:** P0

**Descripción:**

Fases 8-9 del plan (E2E testing) no fueron completadas debido a requerimientos manuales.

**Tests Faltantes:**

1. **Deposit Flow:**
   - [ ] Conectar wallet a frontend
   - [ ] Mint bearer token
   - [ ] Firmar Core.pay() SignedAction
   - [ ] Firmar zkVVM.deposit() SignedAction
   - [ ] Enviar a Fisher via HTTP
   - [ ] Verificar tx en Etherscan
   - [ ] Verificar commitment on-chain
   - [ ] Verificar root actualizada
   - [ ] Verificar nota guardada en localStorage

2. **Withdraw Flow:**
   - [ ] Pegar nota string
   - [ ] Generar ZK proof (browser WASM)
   - [ ] Verificar proof generation exitosa
   - [ ] Firmar zkVVM.withdraw() SignedAction
   - [ ] Enviar a Fisher
   - [ ] Verificar tx en Etherscan
   - [ ] Verificar fondos recibidos
   - [ ] Verificar nullifier marcado
   - [ ] Intentar double-spend (debe fallar)

3. **Edge Cases:**
   - [ ] Insufficient balance
   - [ ] Invalid nullifier
   - [ ] Reused commitment
   - [ ] Merkle proof inválido
   - [ ] Fisher offline (manual fallback)
   - [ ] Network congestion

**Solución:**

Crear **checklist de testing manual** + **automated Playwright tests** para CI.

**Tiempo Estimado:** 1 semana

**Owner:** QA Team

---

## ALTO 🟠 - Importante pero no bloqueante

### 5. No Hay Migración de Notas de Main (COMPATIBILIDAD)

**Severidad:** 🟠 ALTO
**Impacto:** Usuarios pierden acceso a fondos en ShieldedPool
**Prioridad:** P1

**Descripción:**

Usuarios con notas en `main` branch (beta.0, ShieldedPool.sol) no pueden usarlas en `evvm-integration` (beta.18, zkVVM.sol).

**Incompatibilidades:**
- ❌ Noir beta.0 ↔ beta.18 (WASM API cambió)
- ❌ Contrato diferente (ShieldedPool vs zkVVM)
- ❌ Red diferente (Sepolia vs Sepolia EVVM)

**Usuarios Afectados:** Desconocido (revisar analytics)

**Opciones de Solución:**

**Opción A: Período de Gracia**
- Mantener ShieldedPool activo 30 días
- Usuarios retiran fondos manualmente
- Comunicación clara (email, Discord, Twitter)
- Después de 30 días, deprecar main

**Opción B: Tool de Migración**
- Script que:
  1. Genera proof en beta.0
  2. Retira de ShieldedPool.sol
  3. Re-deposita en zkVVM.sol con beta.18
- Complejo, requiere signing de 2 txs

**Opción C: Dual Support**
- Mantener ambos sistemas indefinidamente
- UI con toggle "Legacy Pool" vs "EVVM Pool"
- Mayor complejidad

**Recomendación:** Opción A (comunicación + deadline)

**Tiempo Estimado:** 2 semanas (comunicación + soporte)

**Owner:** Product/Community Team

---

### 6. Scripts de Deployment No Validados (INFRAESTRUCTURA)

**Severidad:** 🟠 ALTO
**Impacto:** Deployment puede fallar en producción
**Prioridad:** P1

**Descripción:**

Scripts de deployment existen pero no han sido probados en workflow completo.

**Scripts Disponibles:**
- `scripts/deploy-zkvvm.js`
- `scripts/deploy-ultra-verifier.js`
- `scripts/deploy-mock-verifier.js`
- `scripts/register-default-root.js`

**Gap:** No hay `deploy-all.sh` que ejecute en orden correcto.

**Solución:**

Crear `deploy-production.sh`:
```bash
#!/bin/bash
set -e

echo "Deploying zkVVM to Production..."

# 1. Deploy UltraVerifier
echo "1/3: Deploying UltraVerifier..."
VERIFIER=$(bunx hardhat run scripts/deploy-ultra-verifier.js --network sepoliaEvvm | grep "0x")

# 2. Deploy zkVVM
echo "2/3: Deploying zkVVM with verifier $VERIFIER..."
ZKVVM=$(WITHDRAW_VERIFIER=$VERIFIER bunx hardhat run scripts/deploy-zkvvm.js --network sepoliaEvvm | grep "0x")

# 3. Register default root
echo "3/3: Registering default Merkle root..."
ZKVVM_ADDRESS=$ZKVVM bunx hardhat run scripts/register-default-root.js --network sepoliaEvvm

echo "✅ Deployment Complete!"
echo "zkVVM: $ZKVVM"
echo "Verifier: $VERIFIER"
```

**Validación:**
- [ ] Dry-run en Hardhat local network
- [ ] Deploy en Sepolia testnet
- [ ] Verificar contratos en Etherscan
- [ ] Probar deposit/withdraw

**Tiempo Estimado:** 3 días

**Owner:** Smart Contracts Team

---

### 7. Circuito Split Notes No Integrado (FEATURE)

**Severidad:** 🟠 ALTO (si es feature prioritaria)
**Impacto:** Feature anunciada pero no usable
**Prioridad:** P2

**Descripción:**

`packages/noir/src/split.nr` existe pero:
- ❌ No compilado como artifact separado
- ❌ No hay UI en frontend
- ❌ No hay integración con zkVVM.sol
- ❌ No documentado

**Split Circuit:** Divide 1 nota en 4 notas de salida

```noir
fn main(
    nullifier_in: pub Field,
    ...
    commitment_1: pub Field,
    commitment_2: pub Field,
    commitment_3: pub Field,
    commitment_4: pub Field,
    ...
) {
    // Verifica: sum(outputs) == input
}
```

**Casos de Uso:**
- Dividir pagos entre múltiples destinatarios
- Mejor privacy (múltiples denominaciones)
- Split change (similar a UTXO Bitcoin)

**Solución:**

Si es feature prioritaria:
1. Compilar `split.nr` como artifact separado
2. Agregar función `split()` a `zkVVM.sol`
3. Crear `SplitPage.tsx` en frontend
4. Documentar casos de uso

Si NO es prioritaria:
- Documentar como "Future Feature"
- Eliminar del scope de v1.0

**Tiempo Estimado:** 2 semanas (si se implementa)

**Owner:** Product Team (decidir prioridad)

---

## MEDIO 🟡 - Mejoras deseables

### 8. No Hay Health Check Endpoint en Fisher

**Severidad:** 🟡 MEDIO
**Prioridad:** P2

**Descripción:**

Fisher solo tiene `POST /execute`. No hay endpoint de health check.

**Solución:**

Agregar en `fisher/index.ts`:
```typescript
// GET /health
app.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: Date.now(),
    version: '1.0.0',
    network: 'sepolia_evvm',
    walletBalance: await checkBalance()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Beneficio:** Uptime monitoring, load balancer health checks

**Tiempo:** 2 horas

---

### 9. Frontend No Tiene Error Boundaries

**Severidad:** 🟡 MEDIO
**Prioridad:** P2

**Descripción:**

Si WASM falla o circuito crash, toda la app se rompe.

**Solución:**

Agregar React Error Boundaries en páginas críticas:
```tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <DashboardPage />
</ErrorBoundary>
```

**Tiempo:** 1 día

---

### 10. No Hay Rate Limiting en Fisher

**Severidad:** 🟡 MEDIO
**Prioridad:** P2

**Descripción:**

Fisher acepta requests ilimitados → vulnerable a spam/DoS.

**Solución:**

Implementar rate limiting con `express-rate-limit` o similar:
```typescript
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 requests por minuto
  message: 'Too many requests, please try again later.'
});

app.post('/execute', limiter, async (req) => { ... });
```

**Tiempo:** 4 horas

---

## BAJO 🟢 - Nice to have

### 11. Documentación de Usuario Final Falta

**Severidad:** 🟢 BAJO
**Prioridad:** P3

Crear guías para usuarios no técnicos:
- Cómo generar nota
- Cómo hacer deposit
- Cómo hacer withdraw
- Troubleshooting

**Tiempo:** 1 semana

---

### 12. No Hay Métricas/Analytics

**Severidad:** 🟢 BAJO
**Prioridad:** P3

Agregar tracking:
- Número de deposits/withdrawals
- Volumen total
- Usuarios activos
- Errores más comunes

**Tiempo:** 3 días

---

### 13. Contract Events No Indexados

**Severidad:** 🟢 BAJO
**Prioridad:** P3

Crear subgraph o backend indexer para eventos:
- `Deposited`
- `Withdrawn`
- `RootRegistered`

**Beneficio:** Query histórico, analytics

**Tiempo:** 1 semana

---

## Checklist de Production Readiness

### Seguridad
- [ ] UltraVerifier real desplegado y probado
- [ ] Audit de smart contracts (externo)
- [ ] Fisher private key en secrets manager
- [ ] Rate limiting en Fisher
- [ ] HTTPS endpoint con certificado válido

### Testing
- [ ] Tests unitarios pasando (100%)
- [ ] E2E tests manuales completos
- [ ] Automated E2E tests (Playwright)
- [ ] Load testing (Fisher puede manejar 100 req/min)
- [ ] Security testing (intentos de exploit)

### Infraestructura
- [ ] Fisher en servidor público
- [ ] Health check endpoint
- [ ] Uptime monitoring configurado
- [ ] Log aggregation
- [ ] Alertas configuradas
- [ ] Backup de claves privadas

### Documentación
- [ ] README actualizado
- [ ] User guides
- [ ] API documentation
- [ ] Deployment runbook
- [ ] Incident response plan

### Legal/Compliance
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Disclaimers de riesgo
- [ ] Compliance review (si aplica)

---

## Timeline de Resolución

### Semana 1-2: Críticos de Seguridad
- Deploy UltraVerifier real
- Testing exhaustivo de verifier
- Security audit (si es posible)

### Semana 3-4: Testing
- Refactor tests unitarios (Nargo workspaces)
- E2E testing manual
- Automated E2E tests

### Semana 5-6: Infraestructura
- Setup Fisher en producción
- Configurar monitoreo
- Load testing

### Semana 7-8: Pre-Launch
- Documentación completa
- Comunicación a usuarios de main
- Final QA pass

**TOTAL: 8 semanas hasta production-ready**

---

## Matriz de Riesgo

| Gap | Probabilidad de Fallo | Severidad | Exposición Total |
|-----|----------------------|-----------|------------------|
| MockVerifier | 100% (ya inseguro) | Alta | ⚠️ Crítica |
| Tests Rotos | Alta | Media | 🔴 Alta |
| Fisher Localhost | 100% (no funciona) | Alta | ⚠️ Crítica |
| No E2E Testing | Alta | Alta | 🔴 Alta |
| Migración Notas | Media | Media | 🟠 Media |
| Scripts Deploy | Media | Baja | 🟡 Media |

---

## Contactos y Ownership

| Área | Owner | Status |
|------|-------|--------|
| Smart Contracts | TBD | ⏳ Pending assignment |
| Circuits/ZK | TBD | ⏳ Pending assignment |
| Frontend | TBD | ⏳ Pending assignment |
| Infrastructure | TBD | ⏳ Pending assignment |
| QA/Testing | TBD | ⏳ Pending assignment |
| Security | TBD | ⏳ Pending assignment |

**Actualizar este documento semanalmente durante roadmap de resolución.**
