enum PaymentOfferTypeEnum {
  EVENTINVITATION,
  CAREGIVE,
  UNDEFINED
}

PaymentOfferTypeEnum getPaymentOfferTypeEnum(String value) {
  switch (value) {
    case 'EventInvitation':
      return PaymentOfferTypeEnum.EVENTINVITATION;
    case 'CareGive':
      return PaymentOfferTypeEnum.CAREGIVE;
    default:
      return PaymentOfferTypeEnum.UNDEFINED;
  }
}

String getPaymentOfferTypeString(PaymentOfferTypeEnum value) {
  switch (value) {
    case PaymentOfferTypeEnum.EVENTINVITATION:
      return 'EventInvitation';
    case PaymentOfferTypeEnum.CAREGIVE:
      return 'CareGive';
    default:
      return 'UNDEFINED';
  }
}