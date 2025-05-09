export const generateProof = async (
  birth_year: number,
  logFn?: (msg: string) => void,
  resultFn?: (proof: string) => void,
  onFinish?: () => void
) => {
  try {
    const { UltraPlonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    const res = await fetch("/circuit.json");
    const circuit = await res.json();

    const noir = new Noir(circuit);
    const backend = new UltraPlonkBackend(circuit.bytecode);

    logFn?.("Generating witness... ⏳");
    const { witness } = await noir.execute({ birth_year, current_year: 2025 });
    logFn?.("Generated witness... ✅");

    logFn?.("Generating proof... ⏳");
    const { proof, publicInputs} = await backend.generateProof(witness);
    logFn?.("Generated proof... ✅");
    resultFn?.(proof);

    logFn?.("Verifying proof... ⌛");
    const isValid = await backend.verifyProof(proof);
    logFn?.(`Proof is ${isValid ? "valid" : "invalid"} ✅`);
    onFinish?.();
  } catch (err) {
    logFn?.("Error generating proof 💔");
    console.error(err);
    onFinish?.();
  }
};
