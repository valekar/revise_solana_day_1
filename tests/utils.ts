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
