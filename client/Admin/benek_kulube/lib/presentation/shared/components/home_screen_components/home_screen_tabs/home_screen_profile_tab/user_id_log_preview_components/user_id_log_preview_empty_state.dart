import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';

class UserIdLogPreviewEmptyStateWidget extends StatelessWidget {
  final double height;
  final double width;

  const UserIdLogPreviewEmptyStateWidget({
    super.key,
    this.height = 350,
    this.width = 350,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 20.0, right: 40.0),
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
            style: const TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 12,
              color: AppColors.benekWhite,
              fontWeight: FontWeight.w400,
            ),
          ),
        )
      ),
    );
  }
}
