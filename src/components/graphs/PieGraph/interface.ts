export interface IBankUsage {
    Bradesco: string;
    'Banco do Brasil': string;
    'Nu Bank': string;
    BS2: string;
    Itaú: string;
    Santander: string;
    Caixa: string;
    'Other/Unknown': string;
}

export interface IPaymentMethodFrequency {
  method: string;
  frequency: number;
}
