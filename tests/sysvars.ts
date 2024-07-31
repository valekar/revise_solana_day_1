import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Sysvars } from "../target/types/sysvars";
import { addSols } from "./utils";

describe("SysVar Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.sysvars as Program<Sysvars>;

  const newAuthority = anchor.web3.Keypair.generate();

  before("Setup env", async () => {
    await addSols(program.provider, newAuthority.publicKey, 2);
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const instruction = await program.methods
      .initialize()
      .accounts({
        signer: newAuthority.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, [
      newAuthority,
    ]);

    console.log("Your transaction signature", tx);
  });
});
