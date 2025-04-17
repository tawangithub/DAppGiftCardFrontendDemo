export function generateUniqueVoucherId(cardId: number) {
  const timestamp = Date.now(); // milliseconds
  const multiplier = BigInt(10) ** BigInt(18);

  return BigInt(cardId) * multiplier + BigInt(timestamp);
}

export async function getPriceInEthWithBuffer(priceInUSD: number) {
  const mockedPrice = process.env.NEXT_PUBLIC_MOCK_ETH_PRICE_IN_USD;
  let ethPrice;
  if (mockedPrice) {
    ethPrice = mockedPrice;
  } else {
    // we fetch the price from coingecko and add buffer of 3% to the price to avoid price fluctuations.
    // If we send more eth than needed, the user will be able to get auto refund from the contract any way.
    const ids = process.env.NEXT_PUBLIC_CRYPTO_CURRENCY || "ethereum";
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    const data = await response.json();
    ethPrice = data[ids].usd;
  }
  const priceInEth = ((priceInUSD / ethPrice) * 1.03).toString(); // threashold 3 percents
  return priceInEth;
}
