import 'package:benek_kulube/data/models/chat_models/payment_offer_model.dart';

import '../../../common/constants/message_type_enum.dart';

class MessageModel {
  String? sendedUserId;
  MessageTypeEnum? messageType;
  String? message;
  String? fileUrl;
  PaymentOfferModel? paymentOffer;
  List<String>? seenBy;
  String? sendDate;
  String? id;

  MessageModel(
      {
        this.sendedUserId,
        this.messageType,
        this.message,
        this.fileUrl,
        this.paymentOffer,
        this.seenBy,
        this.sendDate,
        this.id
      }
      );

  MessageModel.fromJson(Map<String, dynamic> json) {
    sendedUserId = json['sendedUserId'];
    messageType = getMessageTypeEnum(json['messageType']);
    message = json['message'];
    fileUrl = json['fileUrl'];
    paymentOffer = json['paymentOffer'] != null ? PaymentOfferModel.fromJson(json['paymentOffer']) : null;
    seenBy = json['seenBy'].cast<String>();
    sendDate = json['sendDate'];
    id = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['sendedUserId'] = sendedUserId;
    data['messageType'] = getMessageTypeString(messageType ?? MessageTypeEnum.UNDEFINED);
    data['message'] = message;
    data['fileUrl'] = fileUrl;
    data['paymentOffer'] = paymentOffer != null ? paymentOffer!.toJson() : null;
    data['seenBy'] = seenBy;
    data['sendDate'] = sendDate;
    data['_id'] = id;
    return data;
  }
}