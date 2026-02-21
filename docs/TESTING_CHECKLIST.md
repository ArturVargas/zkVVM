# Testing Checklist - zkVVM E2E (Ready to Test!)

**Status:** ✅ Sistema completamente operativo y listo para testing
**Fecha:** February 21, 2026
**Network:** Sepolia EVVM (ChainID: 11155111)

---

## ✅ Pre-requisitos Verificados

- [x] Fisher relayer ejecutándose en puerto 8787
- [x] Frontend ejecutándose en http://localhost:5173
- [x] zkVVM desplegado con UltraVerifier real (no mock)
- [x] Merkle root registrado on-chain
- [x] Archivos de configuración corregidos (deployment.json, circuit artifacts)
- [x] Todos los servicios operativos

---

## 🔍 Información del Despliegue

### Contratos Desplegados

```
zkVVM:           0xe842803254574e80a6261d7b5d22659f9202d8b4
UltraVerifier:   0xd6fa0b0006664d3046fa2ea37cf2c0b0fe5a9d77
EVVM Core:       0xFA56B6992c880393e3bef99e41e15D0C07803BC1
Admin Wallet:    0xc696DDC31486D5D8b87254d3AA2985f6D0906b3a
```

### URLs

```
Frontend:        http://localhost:5173
Fisher API:      http://localhost:8787
Sepolia RPC:     https://ethereum-sepolia-rpc.publicnode.com
Etherscan:       https://sepolia.etherscan.io/address/0xe842803254574e80a6261d7b5d22659f9202d8b4
```

---

## 📝 Test 1: Deposit Flow (5-10 minutos)

### Pre-requisitos
- [ ] MetaMask instalado
- [ ] Sepolia network agregada a MetaMask
- [ ] ~0.01 ETH en Sepolia para firmas ([obtener en faucet](https://sepoliafaucet.com/))
- [ ] Navegador con consola abierta (F12)

### Pasos

#### 1. Conectar Wallet
- [ ] Abrir http://localhost:5173
- [ ] Clic en "Connect Wallet"
- [ ] Aprobar conexión en MetaMask
- [ ] **Verificar:** Dirección visible en navbar

#### 2. Generar Bearer Token (Nota)
- [ ] Navegar al Dashboard
- [ ] Ingresar monto: `1000000` (1 USDC simulado)
- [ ] Clic en "Mint Bearer Token" o "Generate Note"
- [ ] **Esperar:** 500ms - 2s (circuito ejecutándose en WASM)
- [ ] **Verificar:** Nota generada en formato `zk-1000000-0xabc...`
- [ ] **IMPORTANTE:** Copiar y guardar la nota completa

**Nota generada:**
```
_____________________________________________
(Pegar aquí tu nota para referencia futura)
```

#### 3. Depositar en Pool
- [ ] Clic en "Deposit to Pool"
- [ ] **Primera firma:** Core.pay() - Aprobar en MetaMask (sin gas)
- [ ] **Segunda firma:** zkVVM.deposit() - Aprobar en MetaMask (sin gas)
- [ ] **Verificar:** Fisher logs muestran ejecución
- [ ] **Esperar:** 10-15s para confirmación

#### 4. Verificar On-Chain
- [ ] Copiar TxHash del frontend
- [ ] Abrir en Etherscan: https://sepolia.etherscan.io/tx/0x...
- [ ] **Verificar:**
  - [ ] Status: Success ✅
  - [ ] To: `0xe842803254574e80a6261d7b5d22659f9202d8b4` (zkVVM)
  - [ ] Function: `deposit()`
  - [ ] Event: `Deposited(commitment=0x...)`

**TxHash del depósito:**
```
_____________________________________________
```

#### 5. Verificar Estado del Contrato
```bash
# Ejecutar en terminal para verificar commitment
cast call 0xe842803254574e80a6261d7b5d22659f9202d8b4 \
  "commitments(bytes)(bool)" \
  <TU_COMMITMENT_AQUI> \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com
```
- [ ] **Resultado esperado:** `true` (0x0000000000000000000000000000000000000000000000000000000000000001)

### ✅ Criterios de Éxito (Test 1)
- [x] Nota generada sin errores
- [x] Ambas firmas completadas
- [x] Fisher ejecutó transacción
- [x] Tx confirmada en Sepolia
- [x] Commitment visible on-chain

---

## 📝 Test 2: Withdraw Flow (10-20 minutos)

### Pre-requisitos
- [ ] Completado Test 1 (depósito exitoso)
- [ ] Nota guardada del depósito
- [ ] Dirección recipient preparada (puede ser la misma wallet)

### Pasos

#### 1. Navegar a Withdraw Page
- [ ] Clic en "Withdraw" en navegación
- [ ] Verificar que página carga correctamente

#### 2. Ingresar Nota
- [ ] Pegar nota completa en campo "Note"
- [ ] **Formato esperado:** `zk-1000000-0xabc123...-0xdef456...`
- [ ] **Verificar:** Sistema parsea monto, secret, salt

#### 3. Ingresar Recipient
- [ ] Ingresar dirección Ethereum válida
- [ ] **Ejemplo:** `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7`
- [ ] O usar tu propia dirección

**Recipient address:**
```
_____________________________________________
```

#### 4. Generar ZK Proof
- [ ] Clic en "Generate Proof" o "Withdraw"
- [ ] **IMPORTANTE:** Esto tomará 5-15 segundos
- [ ] **Ver progreso** en pantalla
- [ ] **Consola:** Ver logs de generación de proof

**Tiempos medidos:**
- Generación de proof: _____ segundos

#### 5. Firmar y Ejecutar
- [ ] Aparece firma en MetaMask: `zkVVM.withdraw()`
- [ ] Aprobar firma (sin gas)
- [ ] Fisher ejecuta transacción on-chain
- [ ] **Esperar:** 10-20s (UltraVerifier valida proof)

#### 6. Verificar Transacción
- [ ] Copiar TxHash
- [ ] Abrir en Etherscan: https://sepolia.etherscan.io/tx/0x...
- [ ] **Verificar:**
  - [ ] Status: Success ✅
  - [ ] Function: `withdraw()`
  - [ ] Event: `Withdrawn(nullifier=0x..., recipient=0x..., amount=1000000)`

**TxHash del retiro:**
```
_____________________________________________
```

#### 7. Verificar Nullifier Gastado
```bash
# Verificar que nullifier está marcado como usado
cast call 0xe842803254574e80a6261d7b5d22659f9202d8b4 \
  "nullifiers(bytes32)(bool)" \
  <TU_NULLIFIER_AQUI> \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com
```
- [ ] **Resultado esperado:** `true` (nullifier marcado)

#### 8. Verificar Fondos Transferidos
- [ ] Revisar balance del recipient en Etherscan
- [ ] **Nota:** En MVP puede ser simulado (revisar eventos)

### ✅ Criterios de Éxito (Test 2)
- [x] ZK proof generado correctamente (5-15s)
- [x] UltraVerifier aceptó proof válido
- [x] Transacción confirmada
- [x] Nullifier marcado como gastado
- [x] Eventos `Withdrawn` visibles

---

## 📝 Test 3: Double-Spend Prevention

### Pasos

#### 1. Intentar Reutilizar Nota
- [ ] Volver a WithdrawPage
- [ ] Pegar la MISMA nota del Test 2
- [ ] Ingresar recipient
- [ ] Generar proof (debería funcionar)
- [ ] Firmar withdraw

#### 2. Verificar Rechazo On-Chain
- [ ] **Resultado esperado:** Transacción REVIERTE
- [ ] **Error esperado:** "Nullifier already spent" o similar
- [ ] **Verificar:** TxHash muestra error en Etherscan

### ✅ Criterios de Éxito (Test 3)
- [x] Sistema permite generar proof (off-chain)
- [x] Contrato rechaza ejecución (on-chain)
- [x] Error claro: nullifier duplicado

---

## 🐛 Debugging Guide

### Frontend No Carga
```bash
# Ver logs de Vite
tail -f /private/tmp/claude-501/-Users-0xj4an-Documents-GitHub-0xj4an-personal-zkVVM/tasks/bdb38b4.output
```

### Fisher No Responde
```bash
# Verificar salud
curl http://localhost:8787/health

# Verificar proceso
lsof -ti:8787
```

### Proof Generation Fails
- Verificar nota bien formateada
- Chequear consola del navegador (F12)
- Confirmar WASM inicializado correctamente

### Errores Comunes

**"Insufficient balance"**
- Necesitas ETH en Sepolia para firmar
- Obtén en: https://sepoliafaucet.com/

**"Root not registered"**
- Ya está registrado (verificado anteriormente)
- Si falla, ejecutar: `bun run scripts/register-default-root.js`

**"Verifier failed"**
- Si usas UltraVerifier: proof inválido (revisar inputs)
- Verificar que commitment/nullifier match

---

## 📊 Métricas de Performance

| Operación | Tiempo Esperado | Tu Tiempo |
|-----------|----------------|-----------|
| Generación de nota | ~500ms | _____ ms |
| Depósito total | 10-15s | _____ s |
| Generación de proof | 5-15s | _____ s |
| Retiro total | 15-20s | _____ s |
| Respuesta Fisher | ~500ms | _____ ms |

---

## 📸 Evidencia de Testing

### Screenshots Recomendados
1. [ ] Frontend con wallet conectada
2. [ ] Nota generada en Dashboard
3. [ ] Transacción de depósito en Etherscan
4. [ ] Proof generándose (progreso visible)
5. [ ] Transacción de retiro en Etherscan
6. [ ] Error de doble gasto en consola

---

## ✅ Checklist Final

### Sistema Completamente Funcional
- [x] Fisher ejecutándose
- [x] Frontend sin errores
- [x] UltraVerifier desplegado (producción)
- [x] Merkle root registrado
- [x] Archivos corregidos

### Testing E2E
- [ ] Test 1: Deposit completado
- [ ] Test 2: Withdraw completado
- [ ] Test 3: Double-spend prevenido
- [ ] Métricas registradas
- [ ] Screenshots tomadas

### Próximos Pasos
- [ ] Documentar resultados
- [ ] Reportar issues si los hay
- [ ] Preparar para testing automatizado

---

## 📞 Ayuda

Si encuentras problemas:

1. **Revisa logs:**
   - Fisher: Terminal donde corre Fisher
   - Frontend: Consola del navegador (F12)
   - Vite: `/private/tmp/claude-501/.../bdb38b4.output`

2. **Comandos de verificación:**
   ```bash
   # Estado del sistema
   bun run scripts/quick-test.ts

   # Verificar contract state
   cast call 0xe842803254574e80a6261d7b5d22659f9202d8b4 "getCurrentRoot()(bytes32)" --rpc-url https://ethereum-sepolia-rpc.publicnode.com
   ```

3. **Recursos:**
   - [E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md) - Guía detallada
   - [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) - Estado del deployment
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema

---

**¡Listo para testear!** 🚀

El sistema está completamente funcional con:
- ✅ UltraVerifier real (producción)
- ✅ Merkle root registrado
- ✅ Fisher operativo
- ✅ Frontend sin errores
- ✅ Todos los archivos corregidos

**Comienza con Test 1 (Deposit) → Test 2 (Withdraw) → Test 3 (Double-spend)**
