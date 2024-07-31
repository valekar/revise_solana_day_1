use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("YYiXCTU8vjgiXB85Cod7vi3V5rmY73kYuZW6zDAwkdq");

#[program]
pub mod sol_transfer {

    use super::*;

    pub fn send_sol(ctx: Context<SendSol>, amount_in_lamports: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
        );

        let response = system_program::transfer(cpi_context, amount_in_lamports);

        if response.is_err() {
            return err!(SendSolErrors::TransferFailed);
        }
        Ok(())
    }

    pub fn split_sol<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, SplitSol<'info>>,
        amount_in_lamports: u64,
    ) -> Result<()> {
        let amount = amount_in_lamports / ctx.remaining_accounts.len() as u64;

        let system_program = &ctx.accounts.system_program;

        for recipient in ctx.remaining_accounts {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: recipient.to_account_info(),
            };
            let cpi_program = system_program.to_account_info();

            let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

            let res = system_program::transfer(cpi_context, amount);

            if res.is_err() {
                return err!(SendSolErrors::TransferFailed);
            }
        }

        Ok(())
    }
}

#[error_code]
pub enum SendSolErrors {
    #[msg("Transfer failed!")]
    TransferFailed,
}

#[derive(Accounts)]
pub struct SendSol<'info> {
    /// CHECK: This is test transfer!
    #[account(mut)]
    recipient: UncheckedAccount<'info>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SplitSol<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}
