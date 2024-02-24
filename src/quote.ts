import { ethers } from 'ethers'
import { CurrentConfig } from './config.js'
import { computePoolAddress } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json' assert { type: 'json' };
import Quoter2 from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json' assert { type: 'json' };
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' };
import {
    POOL_FACTORY_CONTRACT_ADDRESS,
    QUOTERV2_CONTRACT_ADDRESS,
    QUOTER_CONTRACT_ADDRESS,
} from './constants.js'
import { getProvider } from './providers.js'
import { toReadableAmount, fromReadableAmount } from './conversion.js'

export async function quote(amountIn: string, blockNumber?: number): Promise<string> {
    console.log(blockNumber)
    const quoterContract = new ethers.Contract(
        QUOTER_CONTRACT_ADDRESS,
        Quoter.abi,
        getProvider()
    )
    const poolConstants = await getPoolConstants()

    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        poolConstants.token0,
        poolConstants.token1,
        poolConstants.fee,
        fromReadableAmount(
            // `${CurrentConfig.tokens.amountIn}`,
            amountIn,
            CurrentConfig.tokens.in.decimals
        ).toString(),
        0,
        {
            blockTag: blockNumber
        }
    )

    return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals)
}


export async function quoteV2(amountIn: string, blockNumber?: number): Promise<Object> {
    console.log(blockNumber)
    const quoterV2Contract = new ethers.Contract(
        QUOTERV2_CONTRACT_ADDRESS,
        Quoter2.abi,
        getProvider()
    )
    const poolConstants = await getPoolConstants()

    const params = {
        tokenIn: poolConstants.token0,
        tokenOut: poolConstants.token1,
        fee: poolConstants.fee,
        amountIn:
            fromReadableAmount(
                // `${CurrentConfig.tokens.amountIn}`,
                amountIn,
                CurrentConfig.tokens.in.decimals
            ).toString(),
        sqrtPriceLimitX96: 0,
    }

    let output;

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



    console.log(output.sqrtPriceX96After.toString())

    const sqrtPriceAfter = (+output.sqrtPriceX96After.toString()) / (2 ** 96)

    const priceAfter = (sqrtPriceAfter ** 2) * (10 ** (CurrentConfig.tokens.in.decimals - CurrentConfig.tokens.out.decimals))

    const amountOut = +toReadableAmount(output.amountOut.toString(), 6)

    const price = amountOut / +amountIn

    const priceImpact = ((priceAfter - price) / price) * 100

    const res = {
        amountOut: amountOut,
        price: price,
        priceAfter: priceAfter,
        priceImpact: priceImpact
    }

    return res
}

async function getPoolConstants(): Promise<{
    poolAddress: string
    token0: string
    token1: string
    fee: number
}> {
    const poolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: CurrentConfig.tokens.in,
        tokenB: CurrentConfig.tokens.out,
        fee: CurrentConfig.tokens.poolFee,
    })

    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI.abi,
        getProvider()
    )
    const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
    ])

    return {
        poolAddress,
        token0,
        token1,
        fee,
    }
}
