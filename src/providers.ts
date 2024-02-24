import { ethers, providers } from 'ethers'

export function getProvider(): providers.Provider {
  return new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/989a33ef7f114f45b58346df500b9917')
}
