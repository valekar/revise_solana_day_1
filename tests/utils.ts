import * as anchor from "@coral-xyz/anchor";

export const addSols = async (
  provider: anchor.Provider,
  wallet: anchor.web3.PublicKey,
  amount = 3 * anchor.web3.LAMPORTS_PER_SOL
) => {
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(wallet, amount),
    "confirmed"
  );
};

export const confirmTransaction = async (tx) => {
  const latestBlockHash = await anchor
    .getProvider()
    .connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
};

export const airdropSol = async (
  publicKey,
  amount = 3 * anchor.web3.LAMPORTS_PER_SOL
) => {
  let tx = await anchor
    .getProvider()
    .connection.requestAirdrop(publicKey, amount);

  await confirmTransaction(tx);
};

export const getSamplePDA = (programId) => {
  const seeds = [];
  const pdaAccount = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    programId
  )[0];

  return pdaAccount;
};

export const buildAndSendTransaction = async (instructions, program) => {
  const transaction = new anchor.web3.Transaction();
  transaction.add(...instructions);
  const tx = await program.provider.sendAndConfirm!(transaction, []);
  console.log("Your transaction signature", tx);
};
