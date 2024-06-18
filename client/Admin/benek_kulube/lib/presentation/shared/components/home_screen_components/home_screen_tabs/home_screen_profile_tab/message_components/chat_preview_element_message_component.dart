import 'package:benek_kulube/data/models/chat_models/chat_model.dart';
import 'package:flutter/material.dart';

class ChatPreviewElementMessageComponent extends StatelessWidget {
  final String senderUserName;
  final String message;
  const ChatPreviewElementMessageComponent({
    super.key,
    required this.senderUserName,
    required this.message
  });

  @override
  Widget build(BuildContext context) {
    return RichText(
      overflow: TextOverflow.ellipsis,
      text: TextSpan(
          children: [
            TextSpan(
              text: senderUserName != "" ? '$senderUserName :  ' : '',
              style: const TextStyle(
                  fontFamily: 'Qanelas',
                  fontSize: 8.0,
                  fontWeight: FontWeight.w600
              ),
            ),
            TextSpan(
              text: message,
              style: const TextStyle(
                  fontFamily: 'Qanelas',
                  fontSize: 8.0,
                  fontWeight: FontWeight.w400
              ),
            ),
          ],
      ),
    );
  }
}
