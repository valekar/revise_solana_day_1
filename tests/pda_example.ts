import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaExample } from "../target/types/pda_example";
import { buildAndSendTransaction, getSamplePDA } from "./utils";

describe("SysVar Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PdaExample as Program<PdaExample>;

  it("Is initialized!", async () => {
    const pdaAccount = getSamplePDA(program.programId);

    const instruction = await program.methods
      .initialize()
      .accounts({
        pda: pdaAccount,
        signer: program.provider.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);
  });

  it("Should donate", async () => {
    const pdaAccount = getSamplePDA(program.programId);
    const instruction = await program.methods
      .donate(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({ signer: program.provider.publicKey, pda: pdaAccount })
      .instruction();

    await buildAndSendTransaction([instruction], program);
  });

  it("Should withdraw", async () => {
    const pdaAccount = getSamplePDA(program.programId);
    const instruction = await program.methods
      .withdraw(new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({ signer: program.provider.publicKey, pda: pdaAccount })
      .instruction();

    await buildAndSendTransaction([instruction], program);
  });
});
