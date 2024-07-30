use anchor_lang::prelude::*;

declare_id!("F9fPdvxQsdKLeHjfQe5Jb2fsBZWyH5zBKgFmm6VJnrGw");

#[program]
pub mod sysvars {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let clock_result = Clock::get();

        let clock = match clock_result {
            Ok(clock) => clock,
            Err(_err) => return err!(SysvarError::ClockError),
        };

        msg!("The clock is {:?} ", clock);

        let epoch_schedule_result = EpochSchedule::get();

        let clock = match epoch_schedule_result {
            Ok(clock) => clock,
            Err(_err) => return err!(SysvarError::EpochError),
        };

        msg!("The epoch scheduler is {:?} ", clock);

        let rent_result = Rent::get();

        let rent = match rent_result {
            Ok(rent) => rent,
            Err(_err) => return err!(SysvarError::RentError),
        };

        msg!("The rent is {:?} ", rent);
        Ok(())
    }
}

#[error_code]
pub enum SysvarError {
    #[msg("Could not get clock")]
    ClockError,
    #[msg("Could not get epoch scheduler")]
    EpochError,
    #[msg("Could not get rent")]
    RentError,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}
