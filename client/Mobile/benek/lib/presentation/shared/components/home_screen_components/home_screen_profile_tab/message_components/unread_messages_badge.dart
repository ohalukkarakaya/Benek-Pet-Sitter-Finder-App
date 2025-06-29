import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';


import '../../../../../../../common/constants/app_colors.dart';

class UnreadMessagesBadge extends StatelessWidget {
  final int unreadMessageCount;
  const UnreadMessagesBadge({
    super.key,
    required this.unreadMessageCount,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0),
      height: 20,
      decoration: BoxDecoration(
        color: AppColors.benekLightBlue,
        borderRadius: BorderRadius.circular(50),
      ),
      child: Center(
        child: Text(
          BenekStringHelpers.formatNumberToReadable( unreadMessageCount ),
          style: semiBoldTextStyle( textFontSize: 8.0 ),
        ),
      ),
    );
  }
}
