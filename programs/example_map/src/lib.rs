use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("GR9RF1G4JjrHMRPeG1hkv15yLWucbR9fHw2RkKR6r9jT");

#[program]
pub mod example_map {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, key: String) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>, key: String, value: u64) -> Result<()> {
        ctx.accounts.val.value = value;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(key: String)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<Val>()+ 8, seeds = [key.as_ref()], bump)]
    val: Account<'info, Val>,

    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(key: String)]
pub struct Set<'info> {
    #[account(mut, seeds = [key.as_ref()], bump)]
    val: Account<'info, Val>,
    system_program: Program<'info, System>,
}

#[account]
pub struct Val {
    value: u64,
}
