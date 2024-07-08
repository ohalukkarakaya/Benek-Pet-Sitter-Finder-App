import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class UserIdLogPreviewLoadingWidget extends StatelessWidget {
  final double height;
  final double width;

  const UserIdLogPreviewLoadingWidget({
    super.key,
    this.height = 350,
    this.width = 350,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.benekBlack.withOpacity(0.5),
      highlightColor: AppColors.benekBlack.withOpacity(0.2),
      child: Padding(
        padding: const EdgeInsets.only(top: 20.0, right: 40.0),
        child: Container(
          width: width,
          height: height,
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            color: AppColors.benekBlackWithOpacity,
            borderRadius: BorderRadius.circular(5.0),
          ),
        ),
      ),
    );
  }
}
