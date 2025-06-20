import 'package:benek/common/constants/payment_type_enum.dart';

class PaymentOfferModel {
  String? receiverUserId;
  PaymentOfferTypeEnum? offerType;
  String ? releatedrecordId;

  PaymentOfferModel(
      {
        this.receiverUserId,
        this.offerType,
        this.releatedrecordId
      }
  );

  PaymentOfferModel.fromJson(Map<String, dynamic> json) {
    receiverUserId = json['receiverUserId'];
    offerType = getPaymentOfferTypeEnum(json['offerType']);
    releatedrecordId = json['releatedrecordId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['receiverUserId'] = receiverUserId;
    data['offerType'] = getPaymentOfferTypeString(offerType ?? PaymentOfferTypeEnum.UNDEFINED);
    data['releatedrecordId'] = releatedrecordId;
    return data;
  }
}