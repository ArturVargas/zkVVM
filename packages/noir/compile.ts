import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { CompiledCircuit } from '@noir-lang/types';

async function streamToBytes(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const total = chunks.reduce((acc, c) => acc + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

export async function getCircuit() {
  const fm = createFileManager('/');
  const main = await streamToBytes(
    (await fetch(new URL(`./src/main.nr`, import.meta.url))).body!,
  );
  const nargoToml = await streamToBytes(
    (await fetch(new URL(`./Nargo.toml`, import.meta.url))).body!,
  );
  fm.writeFile('./src/main.nr', main);
  fm.writeFile('./Nargo.toml', nargoToml);
  const result = await compile(fm);
  if (!('program' in result)) {
    throw new Error('Compilation failed');
  }
  return result.program as CompiledCircuit;
}

/** Circuit that takes (value, pk_b, random) and returns (nullifier, commitment, entry, root). Same Poseidon as withdraw. */
export async function getNoteGeneratorCircuit() {
  const fm = createFileManager('/');
  const noteGenerator = await streamToBytes(
    (await fetch(new URL(`./src/note_generator.nr`, import.meta.url))).body!,
  );
  const nargoToml = await streamToBytes(
    (await fetch(new URL(`./Nargo.toml`, import.meta.url))).body!,
  );
  fm.writeFile('./src/main.nr', noteGenerator);
  fm.writeFile('./Nargo.toml', nargoToml);
  const result = await compile(fm);
  if (!('program' in result)) {
    throw new Error('Note generator compilation failed');
  }
  return result.program as CompiledCircuit;
}
