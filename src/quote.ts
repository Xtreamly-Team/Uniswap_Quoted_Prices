import { ethers } from 'ethers'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' };
import Quoter2 from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json' assert { type: 'json' };
import {
    QUOTERV2_CONTRACT_ADDRESS,
} from './constants.js'
import { getProvider } from './providers.js'
import { toReadableAmount, fromReadableAmount, convertPriceX96ToPrice } from './utils.js'

type UniswapQuoteResult = {
    amountIn: number,
    amountOut: number,
    quotedPrice: number,
    poolPriceBefore: number,
    poolPriceAfter: number,
    priceImpact: number,
    priceImpactPercentage: number
}

export async function uniswapQuote(
    amountIn: number, 
    tokenIn: string,
    decimalIn: number,
    tokenOut: string,
    decimalOut: number,
    poolFee: number,
    poolAddress: string,
    blockNumber?: number
): Promise<UniswapQuoteResult> {

    const quoterV2Contract = new ethers.Contract(
        QUOTERV2_CONTRACT_ADDRESS,
        Quoter2.abi,
        getProvider()
    )

    const params = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: poolFee,
        amountIn:
            fromReadableAmount(
                `${amountIn}`,
                decimalIn,
            ).toString(),
        sqrtPriceLimitX96: 0,
    }

    let output: any;

    if (blockNumber) {
        output = await quoterV2Contract.callStatic.quoteExactInputSingle(
            params,
            {
                blockTag: blockNumber
            }
        )
    } else {
        output = await quoterV2Contract.callStatic.quoteExactInputSingle(
            params,
        )
    }

    const priceAfter = convertPriceX96ToPrice(output.sqrtPriceX96After.toString(), decimalIn, decimalOut)

    const amountOut = +toReadableAmount(output.amountOut.toString(), decimalOut)

    const quotedPrice = amountOut / amountIn

    const poolPrice = await uniswapGetPoolPrice(poolAddress, decimalIn, decimalOut, blockNumber)

    const priceImpact = priceAfter - poolPrice

    const priceImpactPercentage = (priceImpact / poolPrice) * 100

    const res = {
        amountIn: amountIn,
        amountOut: amountOut,
        poolPriceBefore: poolPrice,
        quotedPrice: quotedPrice,
        poolPriceAfter: priceAfter,
        priceImpact: priceImpact,
        priceImpactPercentage: priceImpactPercentage
    }


    return res
}

async function uniswapGetPoolPrice(
    poolAddress: string,
    decimalIn: number,
    decimalOut: number,
    blockNumber?: number
): Promise<number> {

    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI.abi,
        getProvider()
    )

    let res: any;

    if (blockNumber) {
        res = await poolContract.callStatic.slot0(
            {
                blockTag: blockNumber
            }
        )
    } else {
        res = await poolContract.callStatic.slot0()
    }

    const price = convertPriceX96ToPrice(res.sqrtPriceX96.toString(), decimalIn, decimalOut)

    return price

}
