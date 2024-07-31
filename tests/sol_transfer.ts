import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolTransfer } from "../target/types/sol_transfer";
import { addSols } from "./utils";

describe("Sol Transfer Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolTransfer as Program<SolTransfer>;

  const newAuthority = anchor.web3.Keypair.generate();

  before("Setup env", async () => {
    await addSols(program.provider, newAuthority.publicKey, 2);
  });

  it("Send sols!", async () => {
    // Add your test here.
    const instruction = await program.methods
      .sendSol(new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        recipient: newAuthority.publicKey,
        signer: program.provider.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);

    const balance = async () => {
      let result = await anchor
        .getProvider()
        .connection.getBalance(newAuthority.publicKey);

      console.log(
        `The account balance of ${newAuthority.publicKey} is ${
          result / anchor.web3.LAMPORTS_PER_SOL
        } sol`
      );
    };

    await balance();
  });

  it("Splits sols to many accounts!", async () => {
    const account1 = anchor.web3.Keypair.generate();
    const account2 = anchor.web3.Keypair.generate();
    const account3 = anchor.web3.Keypair.generate();

    const accountMeta1 = {
      pubkey: account1.publicKey,
      isWritable: true,
      isSigner: false,
    };
    const accountMeta2 = {
      pubkey: account2.publicKey,
      isWritable: true,
      isSigner: false,
    };
    const accountMeta3 = {
      pubkey: account3.publicKey,
      isWritable: true,
      isSigner: false,
    };

    const instruction = await program.methods
      .splitSol(new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        signer: program.provider.publicKey,
      })
      .remainingAccounts([accountMeta1, accountMeta2, accountMeta3])
      .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);

    console.log("Your transaction signature", tx);

    const balance = async (pubKey) => {
      let result = await anchor.getProvider().connection.getBalance(pubKey);

      console.log(
        `The account balance of ${pubKey} is ${
          result / anchor.web3.LAMPORTS_PER_SOL
        } sol`
      );
    };

    await balance(account1.publicKey);
    await balance(account2.publicKey);
    await balance(account3.publicKey);
  });
});
