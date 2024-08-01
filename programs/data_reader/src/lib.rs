use std::mem::size_of;

use anchor_lang::prelude::*;

declare_id!("2mdpoj8AzV6o8YEaKE6oRurnHkS1J4LmFYM2phDx2fmA");

#[program]
pub mod data_reader {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        storage.authority = ctx.accounts.signer.key();
        storage.x = 0;
        Ok(())
    }

    pub fn set_x(ctx: Context<Set>, x: u64) -> Result<()> {
        ctx.accounts.storage.x = x;

        Ok(())
    }

    pub fn get_x(ctx: Context<Get>) -> Result<()> {
        let mut data_slice: &[u8] = &ctx.accounts.storage.data.borrow();
        let data_struct_result = <Storage as AccountDeserialize>::try_deserialize(&mut data_slice);

        let storage = match data_struct_result {
            Ok(storage) => storage,
            Err(_err) => {
                return err!(DataReaderError::DataDeserializationError);
            }
        };

        msg!(
            "The storage x value read through data serialization {} ",
            storage.x
        );

        Ok(())
    }
}

#[error_code]
pub enum DataReaderError {
    #[msg("Could not deserialize the storage data")]
    DataDeserializationError,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, seeds = [], bump, space = 8 + size_of::<Storage>())]
    pub storage: Account<'info, Storage>,
    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut, seeds = [], bump)]
    pub storage: Account<'info, Storage>,
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Get<'info> {
    /// CHECK: Only for reading purpose
    pub storage: UncheckedAccount<'info>,
}

#[account]
pub struct Storage {
    pub x: u64,
    pub authority: Pubkey,
}
