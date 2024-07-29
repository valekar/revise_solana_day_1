use anchor_lang::prelude::*;

declare_id!("AyoQw58UPLqi5gKuhzYTi4Kcd9BcfxNuetUv95p6vdMo");

#[program]
pub mod day_1 {
    use std::collections::HashMap;

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, a: u8, b: u8, message: String) -> Result<()> {
        msg!("The values are a {} and b {}!", a, b);
        let c = a.checked_add(b);

        msg!("C {}", c.unwrap());
        msg!("Your personal message {}", message);
        Ok(())
    }

    pub fn array(ctx: Context<Initialize>, arr: Vec<u64>) -> Result<()> {
        msg!("The arrays are {:?} ", arr);
        Ok(())
    }

    pub fn require_test(ctx: Context<Empty>, a: u64, b: u64) -> Result<()> {
        if a > 1000 {
            return err!(Day1Error::AisTooBig);
        }

        if b < 100 {
            return err!(Day1Error::BisTooSmall);
        }

        msg!("A {} and B {} ", a, b);

        Ok(())
    }

    pub fn require_test_2(ctx: Context<Empty>, a: u64, b: u64) -> Result<()> {
        msg!(" test for require test 2!");
        require!(a <= 1000, Day1Error::AisTooBig);
        require!(b >= 100, Day1Error::BisTooSmall);

        msg!("A {} and B {} ", a, b);

        Ok(())
    }

    pub fn func(ctx_then: Context<Empty>) -> Result<()> {
        msg!("FallBack test for require test 2!");
        Ok(())
    }

    pub fn hash_map(ctx: Context<Initialize>, key: String, value: String) -> Result<()> {
        // Initialize the mapping
        let mut my_map = HashMap::new();

        // Add a key-value pair to the mapping
        my_map.insert(key.to_string(), value.to_string());

        // Log the value corresponding to a key from the mapping
        msg!("My name is {}", my_map[&key]);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Empty {}

#[derive(Accounts)]
pub struct Initialize {}

#[error_code]
pub enum Day1Error {
    #[msg("a is too big!")]
    AisTooBig,
    #[msg("b is too small")]
    BisTooSmall,
}
