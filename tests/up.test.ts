import { expect, test, describe } from "bun:test";
import { Noir } from "@noir-lang/noir_js";
import noteGeneratorArtifact from "../packages/noir/target/note_generator.json" with { type: "json" };
import withdrawArtifact from "../packages/noir/target/withdraw.json" with { type: "json" };
import commitmentHelperArtifact from "../packages/noir/target/commitment_helper.json" with { type: "json" };
import nullifierHelperArtifact from "../packages/noir/target/nullifier_helper.json" with { type: "json" };
import rootHelperArtifact from "../packages/noir/target/root_helper.json" with { type: "json" };

describe("zkVVM Circuit Tests (UltraPlonk)", () => {
    const toHex = (x: bigint): string => `0x${x.toString(16)}`;

    const toBigInt = (fr: any): bigint => {
        if (typeof fr === "bigint") return fr;
        if (typeof fr === "string") return BigInt(fr);
        if (fr.value) return toBigInt(fr.value);
        return BigInt(fr.toString());
    };

    // Helper wrappers
    const getNullifier = async (random: bigint, pk_b: bigint): Promise<bigint> => {
        const noir = new Noir(nullifierHelperArtifact as any);
        const { returnValue } = await noir.execute({ random: toHex(random), pk_b: toHex(pk_b) });
        return toBigInt(returnValue);
    };

    const getCommitment = async (value: bigint, nullifier: bigint): Promise<bigint> => {
        const noir = new Noir(commitmentHelperArtifact as any);
        const { returnValue } = await noir.execute({ value: toHex(value), nullifier: toHex(nullifier) });
        return toBigInt(returnValue);
    };

    const getRoot = async (
        value: bigint,
        from: bigint,
        random: bigint,
        nullifier: bigint,
        depth: number,
        indices: number[],
        siblings: bigint[]
    ): Promise<bigint> => {
        const noir = new Noir(rootHelperArtifact as any);
        const { returnValue } = await noir.execute({
            value: toHex(value),
            from: toHex(from),
            random: toHex(random),
            nullifier_in: toHex(nullifier),
            merkle_proof_length: depth,
            merkle_proof_indices: indices,
            merkle_proof_siblings: siblings.map(toHex),
        });
        return toBigInt(returnValue);
    };

    test("Note Generator Circuit", async () => {
        const noir = new Noir(noteGeneratorArtifact as any);
        const inputs = {
            value: 100n,
            pk_b: 0x123n,
            random: 0xabc123n,
        };

        const { returnValue } = await noir.execute({
            value: toHex(inputs.value),
            pk_b: toHex(inputs.pk_b),
            random: toHex(inputs.random),
        });
        const result = returnValue as any[];

        const expectedNullifier = await getNullifier(inputs.random, inputs.pk_b);
        const expectedCommitment = await getCommitment(inputs.value, expectedNullifier);
        // Entry and Root are more complex, but we can verify Nullifier and Commitment first
        // In note_generator.nr, entry is H(H(v, pk), H(r, n)) and root is H(entry, 0)

        expect(toBigInt(result[0])).toBe(expectedNullifier);
        expect(toBigInt(result[1])).toBe(expectedCommitment);
    });

    test("Withdraw Circuit - Valid Proof", async () => {
        const noir = new Noir(withdrawArtifact as any);

        const value = 500n;
        const pk_b = 0x456n;
        const random = 0xdef456n;
        const recipient = 0x789n;

        const nullifier = await getNullifier(random, pk_b);
        const commitment = await getCommitment(value, nullifier);

        const depth = 10;
        const siblings = new Array(depth).fill(0n);
        const indices = new Array(depth).fill(0);

        const root = await getRoot(value, pk_b, random, nullifier, depth, indices, siblings);

        const inputs = {
            nullifier: toHex(nullifier),
            merkle_proof_length: depth,
            expected_merkle_root: toHex(root),
            recipient: toHex(recipient),
            commitment: toHex(commitment),
            value: toHex(value),
            pk_b: toHex(pk_b),
            random: toHex(random),
            merkle_proof_indices: indices,
            merkle_proof_siblings: siblings.map(toHex),
        };

        const { witness } = await noir.execute(inputs as any);
        expect(witness).toBeDefined();
    });

    test("Withdraw Circuit - Invalid Commitment", async () => {
        const noir = new Noir(withdrawArtifact as any);

        const value = 500n;
        const pk_b = 0x456n;
        const random = 0xdef456n;
        const recipient = 0x789n;

        const nullifier = await getNullifier(random, pk_b);
        const commitment = 0xdeadbeefn; // Wrong

        const depth = 10;
        const siblings = new Array(depth).fill(0n);
        const indices = new Array(depth).fill(0);
        const root = await getRoot(value, pk_b, random, nullifier, depth, indices, siblings);

        const inputs = {
            nullifier: toHex(nullifier),
            merkle_proof_length: depth,
            expected_merkle_root: toHex(root),
            recipient: toHex(recipient),
            commitment: toHex(commitment),
            value: toHex(value),
            pk_b: toHex(pk_b),
            random: toHex(random),
            merkle_proof_indices: indices,
            merkle_proof_siblings: siblings.map(toHex),
        };

        expect(noir.execute(inputs as any)).rejects.toThrow();
    });
});
