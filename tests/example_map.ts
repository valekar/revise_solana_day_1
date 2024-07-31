import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ExampleMap } from "../target/types/example_map";
import { addSols } from "./utils";

describe("SysVar Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ExampleMap as Program<ExampleMap>;

  it("Is initialized!", async () => {
    const key = "example-map-key";

    let [valueAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(key)],
      program.programId
    );

    // Add your test here.
    const instruction = await program.methods
      .initialize(key)
      .accounts({
        val: valueAccount,
        signer: program.provider.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);
  });

  it("Is value set", async () => {
    const key = "example-map-key";

    let [valueAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(key)],
      program.programId
    );

    // Add your test here.
    const instruction = await program.methods
      .set(key, new anchor.BN(12345))
      .accounts({
        val: valueAccount,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);
  });

  it("Should read the value", async () => {
    const key = "example-map-key";

    let [valueAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(key)],
      program.programId
    );
    let valueInfo = await anchor
      .getProvider()
      .connection.getAccountInfo(valueAccount);

    console.log(" The value from web3.js : ", valueInfo);

    let result = await program.account.val.fetch(valueAccount);

    console.log("The value from anchor val :", result.value.toString());
  });
});
