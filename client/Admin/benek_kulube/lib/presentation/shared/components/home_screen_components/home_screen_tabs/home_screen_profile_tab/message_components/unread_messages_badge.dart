import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:flutter/widgets.dart';

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
          style: const TextStyle(
            fontFamily: 'Qanelas',
            fontSize: 8.0,
            color: AppColors.benekBlack,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
