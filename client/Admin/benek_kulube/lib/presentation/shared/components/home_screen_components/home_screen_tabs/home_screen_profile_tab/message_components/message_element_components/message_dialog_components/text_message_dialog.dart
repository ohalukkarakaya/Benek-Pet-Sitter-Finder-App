import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../../common/utils/styles.text.dart';

class TextMessageDialog extends StatelessWidget {
  final String message;
  final bool shouldDisplayAtLeft;
  const TextMessageDialog({
    super.key,
    required this.message,
    this.shouldDisplayAtLeft = true,
  });

  @override
  Widget build(BuildContext context) {
    final maxBubbleWidth = MediaQuery.of(context).size.width * 0.7;

    return Padding(
      padding: EdgeInsets.only(
          right: shouldDisplayAtLeft
            ? 20.0
            : 45.0,
          left: shouldDisplayAtLeft
            ? 45.0
            : 20.0,
      ),
      child: Align(
        alignment: shouldDisplayAtLeft
            ? Alignment.centerLeft
            : Alignment.centerRight,
        child: Container(
          constraints: BoxConstraints(
            maxWidth: maxBubbleWidth,
            minWidth: 40, // çok kısa mesajlar için min genişlik
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          margin: const EdgeInsets.symmetric(vertical: 4),
          decoration: BoxDecoration(
            color: shouldDisplayAtLeft ? AppColors.benekGrey.withOpacity(0.4) : AppColors.benekLightBlue.withOpacity(0.5),
            borderRadius: BorderRadius.all(const Radius.circular(12)),
          ),
          child: Text(
            message,
            style: TextStyle(
              fontFamily: defaultFontFamily(),
              fontSize: 12.0,
              color: AppColors.benekWhite,
              fontWeight: getFontWeight('medium'),
            ),
          ),
        ),
      ),
    );
  }
}
