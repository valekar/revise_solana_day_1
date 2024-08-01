use anchor_lang::prelude::*;
use std::{mem::size_of, str::FromStr};

declare_id!("5b3FiHezoqkM17jBf6YiEE3pYqDvfYbFNGuQ8mg2GdJS");

#[program]
pub mod pda_example {
    use anchor_lang::system_program;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let pda = &ctx.accounts.pda;
        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.pda.to_account_info(),
            },
        );

        let result = system_program::transfer(cpi_context, amount);

        if result.is_err() {
            return err!(PdaError::DonateError);
        }

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let result = ctx.accounts.pda.sub_lamports(amount);

        if result.is_err() {
            return err!(PdaError::WithdrawError);
        }

        let result = ctx.accounts.signer.add_lamports(amount);

        if result.is_err() {
            return err!(PdaError::WithdrawError);
        }

        Ok(())
    }
}

#[error_code]
pub enum PdaError {
    #[msg("Could not donate to pda")]
    DonateError,
    #[msg("Could not withdraw from pda")]
    WithdrawError,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, space = 8 + size_of::<PDA>(), seeds = [], bump, payer = signer)]
    pub pda: Account<'info, PDA>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub pda: Account<'info, PDA>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, address = Pubkey::from_str("HmywQA8MbUcYTGGk6E8x6xBmRduvt3UV4HVyCAczimNb").unwrap())]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub pda: Account<'info, PDA>,
}

#[account]
pub struct PDA {}
