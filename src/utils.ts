import { BigNumber, ethers } from 'ethers'

const READABLE_FORM_LEN = 8

export function fromReadableAmount(
  amount: string,
  decimals: number
): BigNumber {
  return ethers.utils.parseUnits(amount, decimals)
}

export function toReadableAmount(rawAmount: number, decimals: number): string {
  return ethers.utils
    .formatUnits(rawAmount, decimals)
    .slice(0, READABLE_FORM_LEN)
}

export function convertPriceX96ToPrice(priceX96: string, decimalIn: number, decimalOut: number): number {
    const sqrtPrice = (+priceX96) / (2 ** 96)
    return (sqrtPrice ** 2) * (10 ** (decimalIn - decimalOut))
}
