/**
 * Submits a zero-knowledge proof to zkVerify on the server side.
 * @module zkVerifySSR
 */

import { ZkVerifyEvents, zkVerifySession } from "zkverifyjs";

/**
 * Logs a message if a logging function is provided.
 * @param logFn - Optional logging function.
 * @param message - Message to log.
 */
const logStep = (logFn: ((msg: string) => void) | undefined, message: string) => {
  logFn?.(message);
  console.log(`[zkVerifySSR] ${message}`);
};

/**
 * Submits a proof to zkVerify on the server side.
 * @param proofHex - Hex-encoded proof.
 * @param publicInputs - Public inputs for the proof.
 * @param vkHex - Hex-encoded verification key.
 * @param logFn - Optional function to log progress.
 * @param accountMnemonic - Mnemonic for the zkVerify account.
 * @returns Promise that resolves when the proof is submitted.
 * @throws Error if the submission fails.
 */
export async function submitProofToZkVerify(
  proofHex: string,
  publicInputs: any,
  vkHex: string,
  logFn?: (msg: string) => void,
  accountMnemonic: string = "process symptom pen humor shrimp enjoy sort setup castle abuse attitude tape"
): Promise<void> {
  try {
    // Initialize zkVerify session
    logStep(logFn, "Setting up zkVerify session... ⏳");
    const session = await zkVerifySession
      .start()
      .Volta()
      .withAccount(accountMnemonic);
    logStep(logFn, "Session setup complete... ✅");

    // Register verification key
    logStep(logFn, "Registering verification key... ⏳");
    const { events: vkEvents, transactionResult: vkTransactionResult } = await session
      .registerVerificationKey()
      .ultraplonk()
      .execute(vkHex);

    vkEvents.on(ZkVerifyEvents.Finalized, (data) => {
      logStep(logFn, `Verification key registered, hash: ${data.statementHash}`);
    });

    const regInfo = await vkTransactionResult;
    const vkHash = regInfo.statementHash;
    logStep(logFn, `Verification key hash: ${vkHash}`);

    // Submit proof
    logStep(logFn, "Submitting proof... ⏳");
    const { events: verifyEvents, transactionResult: verifyTransactionResult } = await session
      .verify()
      .ultraplonk()
      .withRegisteredVk()
      .execute({
        proofData: {
          vk: vkHash,
          proof: proofHex,
          publicSignals: publicInputs,
        },
        domainId: 0,
      });

    verifyEvents.on(ZkVerifyEvents.IncludedInBlock, (e) =>
      logStep(logFn, `Proof included in block: ${e.statement}`)
    );
    verifyEvents.on(ZkVerifyEvents.Finalized, (e) =>
      logStep(logFn, `Proof finalized: ${JSON.stringify(e)}`)
    );
    verifyEvents.on(ZkVerifyEvents.NewAggregationReceipt, (e) =>
      logStep(logFn, `Aggregation complete: ${JSON.stringify(e)}`)
    );

    await verifyTransactionResult;
    logStep(logFn, "Proof submitted successfully... ✅");
  } catch (err: any) {
    logStep(logFn, `Error submitting proof to zkVerify: ${err.message} 💔`);
    throw new Error(`Failed to submit proof: ${err.message}`);
  }
}