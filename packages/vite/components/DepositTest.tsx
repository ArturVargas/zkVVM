import React, { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useDeposit } from '../hooks/useDeposit.js';
import { toast } from 'react-toastify';
import { parseUsdcAmount } from '../lib/usdc.js';
import { generateNote, saveNote, loadNote } from '../lib/note.js';

export function DepositTest() {
  const { address: walletAddress } = useAccount();
  const {
    isConnected,
    connect,
    disconnect,
    deposit,
    registerRoot,
    isPending,
    isSuccess,
    error,
    poolAddress,
  } = useDeposit();

  const [amountReadable, setAmountReadable] = useState('1');
  const pendingRootRef = useRef<`0x${string}` | null>(null);

  useEffect(() => {
    if (isSuccess) toast.success('Deposit confirmed');
  }, [isSuccess]);
  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  // After deposit confirms, register the Merkle root so the user can withdraw later (single-leaf).
  useEffect(() => {
    if (!isSuccess || !pendingRootRef.current) return;
    const root = pendingRootRef.current;
    pendingRootRef.current = null;
    toast.info('Registering Merkle root…');
    registerRoot(root);
  }, [isSuccess, registerRoot]);

  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      toast.error('Connect wallet first');
      return;
    }
    const value = parseUsdcAmount(amountReadable);
    if (value === null) {
      toast.error('Invalid amount. Use a number like 10.25 (USDC, 6 decimals).');
      return;
    }
    if (value <= 0n) {
      toast.error('Amount must be > 0');
      return;
    }
    setIsGeneratingNote(true);
    try {
      const { note, commitmentHex, rootHex } = await generateNote(value, walletAddress);
      saveNote(note);
      pendingRootRef.current = rootHex;
      deposit(commitmentHex, value);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate note');
    } finally {
      setIsGeneratingNote(false);
    }
  };

  if (!poolAddress) {
    return (
      <section style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Deposit (ShieldedPool)</h2>
        <p style={{ color: '#888' }}>
          Set <code>VITE_POOL_ADDRESS</code> in <code>.env</code> to test deposit from the frontend.
        </p>
      </section>
    );
  }

  if (!isConnected) {
    return (
      <section style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Deposit (ShieldedPool)</h2>
        <p>Connect your wallet to test deposit.</p>
        <button type="button" onClick={() => connect()}>
          Connect wallet
        </button>
      </section>
    );
  }

  const savedNote = loadNote();

  return (
    <section style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Deposit (ShieldedPool)</h2>
      <p style={{ fontSize: 12, color: '#666' }}>
        Single-leaf flow: commitment is generated from your wallet address and a timestamp. Amount in
        USDC (6 decimals), e.g. 10.25. After deposit, the Merkle root is registered so you can
        withdraw later.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Amount (USDC):{' '}
            <input
              type="text"
              inputMode="decimal"
              value={amountReadable}
              onChange={(e) => setAmountReadable(e.target.value)}
              placeholder="10.25"
            />
          </label>
          <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>
            {(() => {
              const raw = parseUsdcAmount(amountReadable);
              return raw !== null && raw > 0n ? `= ${raw.toLocaleString()} units` : null;
            })()}
          </span>
        </div>
        <button type="submit" disabled={isPending || isGeneratingNote}>
          {isGeneratingNote ? 'Generating note…' : isPending ? 'Confirming…' : 'Deposit'}
        </button>
        <button type="button" onClick={() => disconnect()} style={{ marginLeft: 8 }}>
          Disconnect
        </button>
      </form>
      {savedNote && (
        <p style={{ fontSize: 11, color: '#666', marginTop: 12 }}>
          You have a saved note (nullifier, root) for a later withdraw.
        </p>
      )}
    </section>
  );
}
