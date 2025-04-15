import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';

class UserIdLogPreviewEmptyStateWidget extends StatelessWidget {
  final double height;
  final double width;
  final bool shouldGivePaddingToBottom;

  const UserIdLogPreviewEmptyStateWidget({
    super.key,
    this.height = 350,
    this.width = 350,
    this.shouldGivePaddingToBottom = true,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(right: 40.0, bottom: shouldGivePaddingToBottom ? 30.0 : 0),
      child: Container(
        width: width,
        height: height,
        padding: const EdgeInsets.all(10.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlackWithOpacity,
          borderRadius: BorderRadius.circular(5.0),
        ),
        child: Center(
          child: Text(
            BenekStringHelpers.locale('noLog'),
            style: thinTextStyle(
              textColor: AppColors.benekWhite,
              textFontSize: 15,
            ),
          ),
        ),
      )
    );
  }
}
