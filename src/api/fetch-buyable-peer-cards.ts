import { cReadFunction } from "@/hooks/wallet-connection-hook";

export const peerCardsFetcher = async (
  page: number,
  userAddress: string | null,
  cRead: cReadFunction
) => {
  if (!userAddress) return [];
  try {
    const results: any = await cRead("listBuyableGiftCards", [page, 5]);
    console.log("results", results);
    const giftCards = results.items.map((item: any, index: number) => ({
      ...item,
      balanceInUSD: Number(item.balanceInUSD_e2) / 100,
      sellPriceInUSD: Number(item.sellPriceInUSD_e2) / 100,
      owner: results.owners[index],
    }));

    return { giftCards, total: Number(results.total) };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err: any) {
    // already handle error in cRead
  }
};
