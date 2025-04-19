import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../common/constants/app_colors.dart';

class PaymentDataCardLoadingComponent extends StatelessWidget {
  const PaymentDataCardLoadingComponent({super.key});

  @override
  Widget build(BuildContext context) {
    final shimmerBaseColor = AppColors.benekGrey.withOpacity(0.3);
    final shimmerHighlightColor = AppColors.benekWhite.withOpacity(0.3);

    Widget buildShimmerBox({double height = 12, double width = 100, BorderRadius? radius}) {
      return Shimmer.fromColors(
        baseColor: shimmerBaseColor,
        highlightColor: shimmerHighlightColor,
        child: Container(
          height: height,
          width: width,
          decoration: BoxDecoration(
            color: shimmerBaseColor,
            borderRadius: radius ?? BorderRadius.circular(6),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.benekBlack.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Caregiver
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  buildShimmerBox(width: 40, height: 10),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      buildShimmerBox(width: 35, height: 35, radius: BorderRadius.circular(100)),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          buildShimmerBox(width: 100, height: 12),
                          const SizedBox(height: 4),
                          buildShimmerBox(width: 80, height: 10),
                        ],
                      ),
                    ],
                  ),
                ],
              ),

              // Pet owner
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  buildShimmerBox(width: 40, height: 10),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      buildShimmerBox(width: 35, height: 35, radius: BorderRadius.circular(100)),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          buildShimmerBox(width: 100, height: 12),
                          const SizedBox(height: 4),
                          buildShimmerBox(width: 80, height: 10),
                        ],
                      ),
                    ],
                  ),
                ],
              ),

              // Payment info
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  buildShimmerBox(width: 60, height: 14),
                  const SizedBox(height: 4),
                  buildShimmerBox(width: 80, height: 10),
                ],
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Adres
          buildShimmerBox(width: double.infinity, height: 12),
        ],
      ),
    );
  }
}
