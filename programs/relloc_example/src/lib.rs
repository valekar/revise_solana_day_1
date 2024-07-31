use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("D9fCPfoPDbzNZmPXSetSveWP9755z3RnMLh2kvPttWbP");

#[program]
pub mod relloc_example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn increase_my_storage(ctx: Context<IncreaseMyAccount>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, seeds = [], bump, space= size_of::<MyStorage>() + 8)]
    my_storage: Account<'info, MyStorage>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IncreaseMyAccount<'info> {
    // setting realloc::zero = false makes the existing data to persist!
    #[account(mut, realloc = size_of::<MyStorage>() + 8 + 10000, realloc::payer = signer, realloc::zero = false, seeds = [], bump)]
    my_storage: Account<'info, MyStorage>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[account]
pub struct MyStorage {
    x: u64,
}
