export type ReceiptCampaignPrize = {
    id:number,
    title:string,
    description:string,
};

export type receiptCampaignInfo = {
    isActive: boolean,
    title: string,
    description: string,
    companyId:number,
    prizes: ReceiptCampaignPrize[],
};