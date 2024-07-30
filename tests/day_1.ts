import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day1 } from "../target/types/day_1";

describe("day_1", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day1 as Program<Day1>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize(13, 13, "Hello").rpc();

    console.log("Your transaction signature", tx);
  });

  it("Array test", async () => {
    const tx = await program.methods
      .array([new anchor.BN(123), new anchor.BN(56)])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Require Test", async () => {
    const tx = await program.methods
      .requireTest(new anchor.BN(500), new anchor.BN(1000))
      .rpc();

    console.log("Your transaction signature", tx);
  });

  // it("Require Test 2", async () => {
  //   const tx = await program.methods
  //     .requireTest2(new anchor.BN(500), new anchor.BN(1000))
  //     .rpc();

  //   console.log("Your transaction signature", tx);
  // });

  it("Hashmap test", async () => {
    const tx = await program.methods.hashMap("key", "testy").rpc();

    console.log("Your transaction signature", tx);
  });
});
