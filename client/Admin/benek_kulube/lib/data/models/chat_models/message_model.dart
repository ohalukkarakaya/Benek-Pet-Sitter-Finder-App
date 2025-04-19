import 'package:benek_kulube/data/models/chat_models/payment_offer_model.dart';
import 'package:intl/intl.dart';

import '../../../common/constants/message_type_enum.dart';
import '../user_profile_models/user_info_model.dart';

class MessageModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? sendedUserId;
  UserInfo? sendedUser;
  MessageTypeEnum? messageType;
  String? message;
  String? fileUrl;
  PaymentOfferModel? paymentOffer;
  List<String>? seenBy;
  DateTime? sendDate;
  String? id;

  MessageModel(
      {
        this.sendedUserId,
        this.sendedUser,
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
    sendedUser = json['senderUser'] != null ? UserInfo.fromJson(json['senderUser']) : null;
    messageType = getMessageTypeEnum(json['messageType']);
    message = json['message'];
    fileUrl = json['fileUrl'];
    paymentOffer = json['paymentOffer'] != null ? PaymentOfferModel.fromJson(json['paymentOffer']) : null;
    if (json['seenBy'] is List) {
      final rawSeenBy = json['seenBy'] as List;

      if (rawSeenBy.isNotEmpty && rawSeenBy.first is Map && rawSeenBy.first.containsKey('userId')) {
        seenBy = rawSeenBy
            .map((e) => e is Map && e['userId'] != null ? e['userId'].toString() : null)
            .whereType<String>()
            .toList();
      } else if (rawSeenBy.every((e) => e is String)) {
        seenBy = List<String>.from(rawSeenBy);
      } else {
        seenBy = null;
      }
    } else {
      seenBy = null;
    }
    sendDate = format.parse(json['sendDate']);
    id = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['sendedUserId'] = sendedUserId;
    if (sendedUser != null) {
      data['sendedUser'] = sendedUser!.toJson();
    }
    data['messageType'] = getMessageTypeString(messageType ?? MessageTypeEnum.UNDEFINED);
    data['message'] = message;
    data['fileUrl'] = fileUrl;
    data['paymentOffer'] = paymentOffer != null ? paymentOffer!.toJson() : null;
    data['seenBy'] = seenBy;
    data['sendDate'] = sendDate;
    data['_id'] = id;
    return data;
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
          other is MessageModel &&
              runtimeType == other.runtimeType &&
              id == other.id;

  @override
  int get hashCode => id.hashCode;
}