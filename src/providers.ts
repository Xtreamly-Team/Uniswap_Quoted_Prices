import { ethers, providers } from 'ethers'

export function getProvider(): providers.Provider {
  return new ethers.providers.JsonRpcProvider('nd-hrmrouztdfhwnmw5pn255q3i7a.ethereum.managedblockchain.eu-west-2.amazonaws.com')
}
