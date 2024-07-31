import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BasicStorage } from "../target/types/basic_storage";
import { addSols } from "./utils";

describe("Basic Storage Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BasicStorage as Program<BasicStorage>;

  const newAuthority = anchor.web3.Keypair.generate();

  before("Setup env", async () => {
    await addSols(program.provider, newAuthority.publicKey, 2);
  });

  it("Is initialized!", async () => {
    // Add your test here.

    const seeds = [];

    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    const instruction = await program.methods
      .initialize()
      .accounts({
        myStorage: myStorage,
        signer: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);
  });

  it("Set Variable X", async () => {
    const seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    const instruction = await program.methods
      .setX(new anchor.BN(560))
      .accounts({
        myStorage: myStorage,
        signer: program.provider.publicKey,
      })
      .instruction();

    const tx = new anchor.web3.Transaction();
    tx.add(instruction);

    const log = await program.provider.sendAndConfirm!(tx, []);
    console.log("Your transaction signature", log);
  });

  it("Get Variable X", async () => {
    const seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    console.log("The address is ", myStorage.toBase58());

    const instruction = await program.methods
      .getX()
      .accounts({ myStorage: myStorage })
      .instruction();

    const tx = new anchor.web3.Transaction();
    tx.add(instruction);

    const log = await program.provider.sendAndConfirm!(tx, []);
    console.log("Your transaction signature", log);
  });

  it("Reads data directly! ", async () => {
    const seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );
    let data = await program.account.myStorage.fetch(myStorage);

    console.log("The data is ", data.x.toString());
  });

  it("Read data directly using Solana web3", async () => {
    const seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    let myStorageInfo = await anchor
      .getProvider()
      .connection.getAccountInfo(myStorage);
    console.log("The Storage Info :::: ", myStorageInfo);
  });
});
