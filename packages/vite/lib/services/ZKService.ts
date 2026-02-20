import { Barretenberg, Fr } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import { CompiledCircuit } from '@noir-lang/types';

export interface Note {
    value: bigint;
    pk_b: bigint;
    random: bigint;
    nullifier: bigint;
    commitment: bigint;
    entry: bigint;
}

export class ZKService {
    private bb: Barretenberg | null = null;

    async init() {
        if (!this.bb) {
            this.bb = await Barretenberg.new();
        }
    }

    async destroy() {
        if (this.bb) {
            await this.bb.destroy();
            this.bb = null;
        }
    }

    private async getBB(): Promise<Barretenberg> {
        if (!this.bb) await this.init();
        return this.bb!;
    }

    async poseidon2(a: bigint | number | string, b: bigint | number | string): Promise<bigint> {
        const bb = await this.getBB();
        const out = await bb.poseidon2Hash([new Fr(BigInt(a)), new Fr(BigInt(b))]);
        return this.frToBigInt(out);
    }

    async computeEntry(value: bigint, holder: bigint, random: bigint, nullifier: bigint): Promise<bigint> {
        const a = await this.poseidon2(value, holder);
        const b = await this.poseidon2(random, nullifier);
        return await this.poseidon2(a, b);
    }

    async generateNote(value: bigint, recipient: string): Promise<Note> {
        const pk_b = BigInt(recipient);
        // Use window.crypto for secure entropy if available, otherwise fallback (for SSR/Node)
        const randomBytes = new Uint8Array(32);
        if (typeof window !== 'undefined' && window.crypto) {
            window.crypto.getRandomValues(randomBytes);
        } else {
            // Basic fallback, ideally injected or provided by caller
            for (let i = 0; i < 32; i++) randomBytes[i] = Math.floor(Math.random() * 256);
        }

        // Convert bytes to BigInt (simplified)
        let random = 0n;
        for (const b of randomBytes) random = (random << 8n) + BigInt(b);
        // Ensure it's within field range (BN254)
        random = random % 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

        const nullifier = await this.poseidon2(random, pk_b);
        const commitment = await this.poseidon2(value, nullifier);
        const entry = await this.computeEntry(value, pk_b, random, nullifier);

        return {
            value,
            pk_b,
            random,
            nullifier,
            commitment,
            entry,
        };
    }

    async generateProof(circuit: CompiledCircuit, inputs: any) {
        const noir = new Noir(circuit);
        const { witness } = await noir.execute(inputs);
        // Note: Proof generation with bb.js usually happens here in a real app
        // For this boilerplate, we assume noir.execute is enough or user will call bb separately
        return { witness };
    }

    private frToBigInt(fr: any): bigint {
        if (typeof fr === 'bigint') return fr;
        if (fr.toBuffer) return this.bytesToBigIntBE(fr.toBuffer());
        if (fr.toBytes) return this.bytesToBigIntBE(fr.toBytes());
        if (fr.value) return this.frToBigInt(fr.value);
        return BigInt(fr.toString());
    }

    private bytesToBigIntBE(bytes: Uint8Array): bigint {
        let x = 0n;
        for (const b of bytes) x = (x << 8n) + BigInt(b);
        return x;
    }
}

export const zkService = new ZKService();
