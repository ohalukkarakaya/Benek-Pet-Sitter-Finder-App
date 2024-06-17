import 'package:benek_kulube/common/utils/benek_string_helpers.dart';

enum MessageTypeEnum {
  TEXT,
  FILE,
  PAYMENTOFFER,
  USERPROFILE,
  PETPROFILE,
  EVENT,
  UNDEFINED
}

MessageTypeEnum getMessageTypeEnum(String value) {
  switch (value) {
    case 'Text':
      return MessageTypeEnum.TEXT;
    case 'File':
      return MessageTypeEnum.FILE;
    case 'PaymentOffer':
      return MessageTypeEnum.PAYMENTOFFER;
    case 'UserProfile':
      return MessageTypeEnum.USERPROFILE;
    case 'PetProfile':
      return MessageTypeEnum.PETPROFILE;
    case 'Event':
      return MessageTypeEnum.EVENT;
    default:
      return MessageTypeEnum.UNDEFINED;
  }
}

String getMessageTypeString(MessageTypeEnum value) {
  switch (value) {
    case MessageTypeEnum.TEXT:
      return 'Text';
    case MessageTypeEnum.FILE:
      return 'File';
    case MessageTypeEnum.PAYMENTOFFER:
      return 'PaymentOffer';
    case MessageTypeEnum.USERPROFILE:
      return 'UserProfile';
    case MessageTypeEnum.PETPROFILE:
      return 'PetProfile';
    case MessageTypeEnum.EVENT:
      return 'Event';
    default:
      return 'Undefined';
  }
}

String getMessageTypeTitle(MessageTypeEnum value) {
  switch (value) {
    case MessageTypeEnum.TEXT:
      return BenekStringHelpers.locale('textMessageTitle');
    case MessageTypeEnum.FILE:
      return BenekStringHelpers.locale('fileMessageTitle');
    case MessageTypeEnum.PAYMENTOFFER:
      return BenekStringHelpers.locale('paymentOfferMessageTitle');
    case MessageTypeEnum.USERPROFILE:
      return BenekStringHelpers.locale('userProfileMessageTitle');
    case MessageTypeEnum.PETPROFILE:
      return BenekStringHelpers.locale('petProfileMessageTitle');
    case MessageTypeEnum.EVENT:
      return BenekStringHelpers.locale('eventMessageTitle');
    default:
      return BenekStringHelpers.locale('undefinedMessageType');
  }
}