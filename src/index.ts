import { CurrentConfig } from "./config.js";
import { toReadableAmount } from "./conversion.js";
import { quote, quoteV2 } from "./quote.js";

const main = async () => {
    let quotedPrice = await quote('1')
    console.log(quotedPrice)
    let quotedV2Output = await quoteV2('1')
    console.log(quotedV2Output)

    // console.log(toReadableAmount(price, CurrentConfig.tokens.out.decimals))
    // const writeApi = await initializeInflux()
    // const exchangeStatus = ExchangeStatus
    // setInterval(async () => {
    //     console.log(
    //         JSON.stringify({
    //             timestamp: Date.now(),
    //             price: +(await quote())
    //         })
    //     )
    //
    // }, 1000);
}

main()
