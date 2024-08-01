import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DataReader } from "../target/types/data_reader";
import { buildAndSendTransaction, getSamplePDA } from "./utils";

describe("Data Reader Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DataReader as Program<DataReader>;

  it("Is initialized!", async () => {
    const pdaAccount = getSamplePDA(program.programId);

    const instruction = await program.methods
      .initialize()
      .accounts({
        storage: pdaAccount,
        signer: program.provider.publicKey,
      })
      .instruction();

    await buildAndSendTransaction([instruction], program);
  });

  it("Should set x value", async () => {
    const pdaAccount = getSamplePDA(program.programId);

    const instruction = await program.methods
      .setX(new anchor.BN(345))
      .accounts({ storage: pdaAccount, authority: program.provider.publicKey })
      .instruction();

    await buildAndSendTransaction([instruction], program);
  });

  it("Should read x value", async () => {
    const pdaAccount = getSamplePDA(program.programId);

    const instruction = await program.methods
      .getX()
      .accounts({ storage: pdaAccount })
      .instruction();

    await buildAndSendTransaction([instruction], program);
  });
});
