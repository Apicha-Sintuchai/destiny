export type ProxyInfo = {
    type: string | null;
    value: string | null;
};

export type AccountInfo = {
    type: string;
    value: string;
};

export type Participant = {
    displayName: string;
    name: string;
    proxy: ProxyInfo;
    account: AccountInfo;
};

export type TransactionData = {
    language: string;
    transRef: string;
    sendingBank: string;
    receivingBank: string;
    transDate: string;
    transTime: string;
    sender: Participant;
    receiver: Participant;
    amount: number;
    paidLocalAmount: number;
    paidLocalCurrency: string;
    countryCode: string;
    transFeeAmount: number;
    ref1: string;
    ref2: string;
    ref3: string;
    toMerchantId: string;
};

export type Quota = {
    usage: number;
    limit: number;
};

export type Subscription = {
    id: string;
    postpaid: boolean;
};

export type TransactionResponse = {
    discriminator: string;
    valid: boolean;
    data: TransactionData;
    quota: Quota;
    subscription: Subscription;
    isCached: boolean;
};

export type PaymentMethod = "QR" | "BANK";
