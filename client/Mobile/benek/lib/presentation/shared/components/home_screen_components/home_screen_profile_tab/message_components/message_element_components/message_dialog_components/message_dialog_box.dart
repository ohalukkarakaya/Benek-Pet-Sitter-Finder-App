import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/message_components/message_element_components/message_dialog_components/text_message_dialog.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../../common/constants/message_type_enum.dart';
import '../../../../../../../../../data/models/chat_models/payment_offer_model.dart';
import 'file_massage_dialog.dart';

class MessageDialogBox extends StatelessWidget {
  final bool shouldDisplayAtLeft;
  final MessageTypeEnum messageType;
  final String? message;
  final String? fileUrl;
  final PaymentOfferModel? paymentOffer;
  final DateTime? sendDate;

  const MessageDialogBox({
    super.key,
    this.shouldDisplayAtLeft = true,
    required this.messageType,
    this.message,
    this.fileUrl,
    this.paymentOffer,
    this.sendDate,
  });

  @override
  Widget build(BuildContext context) {
    switch(messageType) {
      case MessageTypeEnum.TEXT:
        return TextMessageDialog(message: message!, shouldDisplayAtLeft: shouldDisplayAtLeft, sendDate: sendDate);
      case MessageTypeEnum.FILE:
        return FileMassageDialog(filePath: fileUrl!, shouldDisplayAtLeft: shouldDisplayAtLeft);
      // case MessageTypeEnum.USERPROFILE:
      //   return const Text('User Profile');
      // case MessageTypeEnum.PAYMENTOFFER:
      //   return const Text('PAYMENTOFFER');
      default:
        return const Text('Unknown message type');
    }
  }
}
