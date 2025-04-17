import { cReadFunction } from "@/hooks/wallet-connection-hook";
interface CardType {
  id: number;
  balanceInUSD_e2: number;
  sellPriceInUSD_e2: number;
  numberOfRemainingGiftCards: number;
  waitingAfterBuyInMonths: number;
  expireAfterBuyInYears: number;
  isActive: boolean;
}

export const cardTypesFetcher = async (
  userAddress: string | null,
  cRead: cReadFunction
) => {
  if (!userAddress) return [];
  try {
    const cardTypes: CardType[] = await cRead("listContractGiftCardTypes", []);
    return cardTypes
      .map((cardType: CardType) => ({
        ...cardType,
        balanceInUSD: Number(cardType.balanceInUSD_e2) / 100,
        sellPriceInUSD: Number(cardType.sellPriceInUSD_e2) / 100,
      }))
      .filter((cardType: any) => cardType.isActive);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err: any) {
    //alredy handle erorr in cRead
  }
};
