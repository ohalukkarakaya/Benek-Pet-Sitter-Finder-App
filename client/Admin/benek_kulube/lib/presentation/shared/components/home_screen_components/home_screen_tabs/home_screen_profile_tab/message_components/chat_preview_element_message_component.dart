import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

class ChatPreviewElementMessageComponent extends StatelessWidget {
  final bool areThereUnreadMessages;
  final String senderUserName;
  final String message;
  const ChatPreviewElementMessageComponent({
    super.key,
    required this.areThereUnreadMessages,
    required this.senderUserName,
    required this.message
  });

  @override
  Widget build(BuildContext context) {
    return RichText(
      overflow: TextOverflow.ellipsis,
      maxLines: 3,
      text: TextSpan(
          children: [
            TextSpan(
              text: senderUserName != "" ? '$senderUserName :  ' : "${BenekStringHelpers.locale('missingUser')}: ",
              style: TextStyle(
                  fontFamily: defaultFontFamily(),
                  fontSize: 8.0,
                  color: AppColors.benekLightBlue,
                  fontWeight: areThereUnreadMessages
                      ? getFontWeight('black')
                      : getFontWeight('semiBold')
              ),
            ),
            TextSpan(
              text: message,
              style: TextStyle(
                  fontFamily: defaultFontFamily(),
                  fontSize: 8.0,
                  fontWeight: areThereUnreadMessages
                      ? getFontWeight('black')
                      : getFontWeight('semiBold')
              ),
            ),
          ],
      ),
    );
  }
}
