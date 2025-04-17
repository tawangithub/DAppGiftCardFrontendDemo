import { GiftCard } from "@/components/card-list/list-issued-cards";
import { cReadFunction } from "@/hooks/wallet-connection-hook";

export const fetchCardDetail = async (cardId: number, cRead: cReadFunction) => {
  try {
    const cardDetail: GiftCard = await cRead("viewGiftCard", [cardId]);
    if (!cardDetail) return null;

    return {
      ...cardDetail,
      balanceInUSD: Number((cardDetail as any).balanceInUSD_e2) / 100,
      sellPriceInUSD: Number((cardDetail as any).sellPriceInUSD_e2) / 100,
      startDate: new Date(Number((cardDetail as any).startDate) * 1000),
      expirationDate:
        cardDetail.expirationDate > 0
          ? new Date(Number((cardDetail as any).expirationDate) * 1000)
          : null,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err: any) {
    //alredy handle erorr in cRead
  }
};
