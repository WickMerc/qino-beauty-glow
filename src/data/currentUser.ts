// =====================================================================
// QINO — Current User ID
// Hardcoded mock user ID for prototype. When auth lands (iteration 11),
// this file is replaced with a hook that returns session.user.id.
//
// Every Supabase query that needs a user_id imports from here so the
// migration is a one-line change.
// =====================================================================

/**
 * The mock user ID matching the seed row in the `profiles` table.
 * Used everywhere a user_id is needed during the no-auth prototype phase.
 */
export const CURRENT_USER_ID = "user_mock_1";
