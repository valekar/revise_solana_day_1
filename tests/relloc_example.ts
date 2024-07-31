import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RellocExample } from "../target/types/relloc_example";
import { addSols } from "./utils";

describe("Relloc Example Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.RellocExample as Program<RellocExample>;

  it("Is initialized!", async () => {
    const seeds = [];

    const [myStorageAccount, _bump] =
      anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

    // Add your test here.
    const instruction = await program.methods
      .initialize()
      .accounts({
        myStorage: myStorageAccount,
        signer: program.provider.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);
  });

  it("Should increase the size of MyStorage now", async () => {
    const seeds = [];

    const [myStorageAccount, _bump] =
      anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

    // Add your test here.
    const instruction = await program.methods
      .increaseMyStorage()
      .accounts({
        myStorage: myStorageAccount,
        signer: program.provider.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);
  });
});
