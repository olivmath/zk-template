/**
 * Gera e verifica uma prova de conhecimento zero para um ano de nascimento.
 * @module proofGeneration
 */

import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";


/**
 * Gera e verifica uma prova de conhecimento zero para um ano de nascimento.
 * @param birthYear - Ano de nascimento para provar.
 * @param logFn - Função opcional para logar progresso.
 * @param onFinish - Callback opcional quando o processo completa ou falha.
 */
export const generateProof = async (birthYear, logFn, onFinish) => {
  try {
    // Configuração inicial
    logFn?.(false, "Configurando sessão... ⏳");
    const res = await fetch("/circuit.json");
    const circuit = await res.json();

    const noir = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode);
    logFn?.(false, "Sessão configurada... ✅");


    // Geração de testemunha e prova
    logFn?.(false, "Gerando testemunha... ⏳");
    const { witness } = await noir.execute({
      birth_year: birthYear,
      current_year: 2025,
    });
    logFn?.(false, "Testemunha gerada... ✅");

    logFn?.(false, "Gerando prova... ⏳");
    const { proof, publicInputs } = await backend.generateProof(witness);
    logFn?.(false, "Prova gerada... ✅");


    // Verificação local da prova
    logFn?.(false, "Verificando prova localmente... ⌛");
    const isValid = await backend.verifyProof({ proof, publicInputs });
    logFn?.(false, `Prova é ${isValid ? "válida" : "inválida"} ✅`);


    // Conversão para formato hexadecimal
    const vk = await backend.getVerificationKey();
    const proofHex = "0x" + Buffer.from(proof).toString("hex");
    const vkHex = "0x" + Buffer.from(vk).toString("hex");

    logFn?.(true, `Prova em hex: ${proofHex}`);
    logFn?.(true, `Chave de verificação: ${vkHex}`);


    // Submissão da prova
    fetch("/api/submit-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofHex, publicInputs, vkHex }),
    });

    onFinish?.();
  } catch (err) {
    logFn?.(false, "Erro ao gerar prova 💔");
    console.error("Falha na geração da prova:", err);
    onFinish?.();
  }
};
