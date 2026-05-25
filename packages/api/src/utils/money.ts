export function penceToGbp(pence: number): number {
  return Math.round(pence) / 100;
}

export function gbpToPence(gbp: number): number {
  return Math.round(gbp * 100);
}
