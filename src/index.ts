import { FeeAmount } from "@uniswap/v3-sdk";
import { USDT_TOKEN, WETH_TOKEN } from "./constants.js";
import { uniswapQuote } from "./quote.js";
import { convertPriceX96ToPrice } from "./utils.js"

const main = async () => {
    let quotedV2Output = await uniswapQuote(1000, 
        WETH_TOKEN.address, WETH_TOKEN.decimals, 
        USDT_TOKEN.address, USDT_TOKEN.decimals,
        FeeAmount.LOW,
        19297545
    )
    
}

main()
