import { uniswapQuote } from "./quote.js";

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3500;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// POST endpoint with multiple query parameters
app.post('/api/quote_prices', async (req, res) => {
    // Retrieve query parameters from the request body
    const { amountIn, tokenIn, decimalIn, tokenOut, decimalOut, poolFee } = req.body;

    console.log(amountIn)
    console.log(tokenIn)
    console.log(decimalIn)
    console.log(tokenOut)
    console.log(decimalOut)
    console.log(poolFee)


    let blockNumber = req.body.blockNumber

    // Check if required parameters are present
    if (!amountIn || !tokenIn || !decimalIn || !tokenOut || !decimalOut || !poolFee) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {

        // Process the parameters (in this example, just echoing them back)
        // const result = { param1, param2, param3 };
        let quotedV2Output = await uniswapQuote(amountIn,
            tokenIn, decimalIn, tokenOut, decimalOut, poolFee, blockNumber)

        // Send the JSON response
        res.json(quotedV2Output);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
