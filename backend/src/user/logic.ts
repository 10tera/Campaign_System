const isPostCode = (value: string) => {
    const check = /^[0-9]+$/;
    return check.test(value) && value.length === 7;
};

const isAddress = (value:string) => {
    return value.length > 0;
};

const isName = (value:string) => {
    return value.length > 0 && value.length < 65;
};

const isFurigana = (value:string) => {
    const check = /^[ァ-ンヴー]+$/;
    return check.test(value) && value.length < 65;
};

const isPhone = (value: string) => {
    const check = /^[0-9]+$/;
    return check.test(value) && value.length === 11;
};

const isBirth = (value:string) => {
    return value.length > 0 && value.length < 15;
};

export {isPostCode,isAddress,isName,isFurigana,isPhone,isBirth};