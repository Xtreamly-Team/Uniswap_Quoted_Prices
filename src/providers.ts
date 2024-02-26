import { ethers, providers } from 'ethers'

export function getProvider(): providers.Provider {
  return new ethers.providers.JsonRpcProvider('https://nd-hrmrouztdfhwnmw5pn255q3i7a.t.ethereum.managedblockchain.eu-west-2.amazonaws.com?billingtoken=nVBr2VZ5akyj5lRHEOGxobat73ULeOZbm7nBagveIH')
}
