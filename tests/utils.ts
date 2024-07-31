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
