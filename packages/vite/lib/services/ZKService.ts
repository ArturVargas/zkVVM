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
  root: bigint;
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

  private toHex(x: bigint | number): string {
    return `0x${x.toString(16)}`;
  }

  private toBigInt(fr: any): bigint {
    if (fr === undefined || fr === null) throw new Error('toBigInt: value is undefined or null');
    if (typeof fr === 'bigint') return fr;
    if (typeof fr === 'number') return BigInt(fr);
    if (typeof fr === 'string') {
      const trimmed = fr.trim();
      try {
        return BigInt(trimmed);
      } catch (e: any) {
        throw e;
      }
    }
    if (fr instanceof Uint8Array || (fr.constructor && fr.constructor.name === 'Uint8Array')) {
      return this.bytesToBigIntBE(fr);
    }
    if (fr.value) return this.toBigInt(fr.value);
    if (fr.toBuffer) return this.bytesToBigIntBE(fr.toBuffer());
    if (fr.toBytes) return this.bytesToBigIntBE(fr.toBytes());
    try {
      return BigInt(fr.toString());
    } catch (e: any) {
      throw e;
    }
  }

  private bytesToBigIntBE(bytes: Uint8Array): bigint {
    let x = 0n;
    for (const b of bytes) x = (x << 8n) + BigInt(b);
    return x;
  }

  /**
   * Executes a Noir circuit with the given inputs.
   * Automatically handles BigInt to Hex conversion for Field members.
   */
  async executeCircuit(circuit: CompiledCircuit, inputs: Record<string, any>): Promise<any> {
    const noir = new Noir(circuit);
    const processedInputs = this.prepareInputs(inputs);
    const { returnValue } = await noir.execute(processedInputs);
    return returnValue;
  }

  private prepareInputs(inputs: any): any {
    if (typeof inputs === 'bigint') return this.toHex(inputs);
    if (Array.isArray(inputs)) return inputs.map(i => this.prepareInputs(i));
    if (typeof inputs === 'object' && inputs !== null) {
      const result: any = {};
      for (const key in inputs) {
        result[key] = this.prepareInputs(inputs[key]);
      }
      return result;
    }
    return inputs;
  }

  /**
   * High-level API for creating a note using note_generator circuit.
   */
  async generateNote(
    circuit: CompiledCircuit,
    value: bigint,
    recipient: string,
    randomOverride?: bigint,
  ): Promise<Note> {
    const pk_b = BigInt(recipient);
    let random = randomOverride;

    if (random === undefined) {
      const randomBytes = new Uint8Array(32);
      if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(randomBytes);
      } else {
        for (let i = 0; i < 32; i++) randomBytes[i] = Math.floor(Math.random() * 256);
      }
      random =
        this.bytesToBigIntBE(randomBytes) %
        21888242871839275222246405745257275088548364400416034343698204186575808495617n;
    }

    const result = await this.executeCircuit(circuit, {
      value,
      pk_b,
      random,
    });

    return {
      value,
      pk_b,
      random: random!,
      nullifier: this.toBigInt(result[0]),
      commitment: this.toBigInt(result[1]),
      entry: this.toBigInt(result[2]),
      root: this.toBigInt(result[3]),
    };
  }

  /**
   * Generates a withdrawal proof using the withdraw circuit.
   */
  async generateWithdrawProof(
    circuit: CompiledCircuit,
    note: Note,
    recipient: bigint,
    merkleRoot: bigint,
    merkleProof: { indices: number[]; siblings: bigint[] },
  ) {
    const inputs = {
      nullifier: note.nullifier,
      merkle_proof_length: merkleProof.indices.length,
      expected_merkle_root: merkleRoot,
      recipient: recipient,
      commitment: note.commitment,
      value: note.value,
      pk_b: note.pk_b,
      random: note.random,
      merkle_proof_indices: merkleProof.indices,
      merkle_proof_siblings: merkleProof.siblings,
    };

    const noir = new Noir(circuit);
    return await noir.execute(this.prepareInputs(inputs));
  }

  // Poseidon fallback/helpers for cases where circuit is not available
  async poseidon2(a: bigint | number | string, b: bigint | number | string): Promise<bigint> {
    const bb = await this.getBB();
    try {
      const out = await bb.poseidon2Hash([new Fr(BigInt(a)), new Fr(BigInt(b))]);
      return this.toBigInt(out);
    } catch (e: any) {
      throw e;
    }
  }
}

export const zkService = new ZKService();
