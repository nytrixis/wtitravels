/**
 * Prices were published in US dollars on the original site. They are shown in rupees,
 * converted once, here. Change USD_TO_INR to re-price everything (then rebuild).
 */
export const USD_TO_INR = 85;

/** Converts a USD amount to rupees, rounded to the nearest ₹50. */
export const inr = (usd: number): number => Math.round((usd * USD_TO_INR) / 50) * 50;

/** ₹5,100 — Indian digit grouping. */
export const formatInr = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;
