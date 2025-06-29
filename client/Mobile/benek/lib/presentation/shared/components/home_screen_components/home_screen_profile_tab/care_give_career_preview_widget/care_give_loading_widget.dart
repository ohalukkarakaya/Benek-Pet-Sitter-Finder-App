import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class CareGiveLoadingWidget extends StatelessWidget {
  const CareGiveLoadingWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    // Profil dairesinin boyutu
    final avatarSize = screenWidth * 0.08; // ör: %8
    final smallBoxWidth = screenWidth * 0.04; // ör: %4
    final mediumBoxWidth = screenWidth * 0.15; // ör: %15
    final largeBoxWidth = screenWidth * 0.25; // ör: %25
    final buttonWidth = screenWidth * 0.25; // ör: %25

    return Shimmer.fromColors(
      baseColor: AppColors.benekBlack.withAlpha((0.4 * 255).toInt()),
      highlightColor: AppColors.benekBlack.withAlpha((0.2 * 255).toInt()),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: avatarSize,
                height: avatarSize,
                decoration: const BoxDecoration(
                  color: AppColors.benekWhite,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
          Container(
            width: buttonWidth,
            height: avatarSize,
            decoration: BoxDecoration(
              color: AppColors.benekBlack,
              borderRadius: BorderRadius.circular(2.0),
            ),
          ),
        ],
      ),
    );
  }
}