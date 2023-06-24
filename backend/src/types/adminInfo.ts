export type ReceiptCampaignPrize = {
    title:string,
    description:string,
};
export type EachQuestion = {
    sentence:string,
};
export type OneTouchPrize = {
    title:string,
    description:string,
    point:number,
};

export type AdminInfoType ={
    id:string,
    name:string,
    receiptCampaign:{
        isActive:boolean,
        title:string,
        description:string,
        //応募規約の有無の確認待ち
        terms:string,
        prizes:ReceiptCampaignPrize[],
    },
    shoppingRally:{
        isActive:boolean,
        title:string,
        description:string,
        imgPath:string,
    },
    questionnaire:{
        isActive:boolean,
        title:string,
        description:string,
        point:number,
        questions:EachQuestion[],
    },
    oneTouch:{
        isActive:boolean,
        title:string,
        description: string,
        prizes:OneTouchPrize[],
    },
    instantWin:{
        isActive:boolean,
        title:string,
        description:string,
        probability:number,
    },
};