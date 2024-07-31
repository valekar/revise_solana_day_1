use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("HTfqYyFeQgM6nzGfDWWVTJwrPVRJu23YG51zT7gn9isA");

#[program]
pub mod basic_storage {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn set_x(ctx: Context<Set>, x: u64) -> Result<()> {
        ctx.accounts.my_storage.x = x;
        Ok(())
    }

    pub fn get_x(ctx: Context<Get>) -> Result<()> {
        let x = ctx.accounts.my_storage.x;

        msg!("The X value is {:?} ", x);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<MyStorage>() + 8 , seeds = [], bump)]
    pub my_storage: Account<'info, MyStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut, seeds = [], bump)]
    pub my_storage: Account<'info, MyStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Get<'info> {
    #[account(seeds = [], bump)]
    pub my_storage: Account<'info, MyStorage>,
}

#[account]
#[derive(Default)]
pub struct MyStorage {
    x: u64,
}
