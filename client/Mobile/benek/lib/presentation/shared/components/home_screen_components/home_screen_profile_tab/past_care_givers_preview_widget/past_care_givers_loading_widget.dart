import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class PastCareGiversLoadingWidget extends StatelessWidget {
  const PastCareGiversLoadingWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    final avatarSize = screenWidth * 0.08;       // İlk avatar boyutu (ör: %8)
    final smallAvatarSize = screenWidth * 0.07;  // Üstteki ikinci avatar (ör: %7)
    final smallBoxWidth = screenWidth * 0.02;    // Küçük kutucuk
    final mediumBoxWidth = screenWidth * 0.12;   // Orta kutucuk
    final shortBoxWidth = screenWidth * 0.10;    // Daha kısa kutucuk
    final buttonWidth = screenWidth * 0.18;      // Sağdaki buton
    final buttonHeight = avatarSize;             // Aynı yükseklik

    return Shimmer.fromColors(
      baseColor: AppColors.benekBlack.withAlpha((0.5 * 255).toInt()),
      highlightColor: AppColors.benekBlack.withAlpha((0.2 * 255).toInt()),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Stack(
                children: [
                  Container(
                    width: avatarSize,
                    height: avatarSize,
                    decoration: const BoxDecoration(
                      color: AppColors.benekWhite,
                      shape: BoxShape.circle,
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.only(left: avatarSize * 0.4, top: avatarSize * 0.15),
                    child: Container(
                      width: smallAvatarSize,
                      height: smallAvatarSize,
                      decoration: const BoxDecoration(
                        color: AppColors.benekWhite,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          Container(
            width: buttonWidth,
            height: buttonHeight,
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