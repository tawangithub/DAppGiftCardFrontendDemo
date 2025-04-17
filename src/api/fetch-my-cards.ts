import { cReadFunction } from "@/hooks/wallet-connection-hook";

export const myCardsFetcher = async (
  userAddress: string | null,
  cRead: cReadFunction
) => {
  if (!userAddress) return [];
  try {
    let myCards: any = await cRead("listMyOwnGiftCards", []);
    // remove the duplicate ids from the array
    myCards = myCards.filter(
      (card: any, index: number, self: any) =>
        index === self.findIndex((c: any) => c.id === card.id)
    );

    return myCards.map((cardType: any) => ({
      ...cardType,
      balanceInUSD: Number(cardType.balanceInUSD_e2) / 100,
      sellPriceInUSD: Number(cardType.sellPriceInUSD_e2) / 100,
    }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err: any) {
    // already handle error in cRead
  }
};
