import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class PastCareGiversLoadingWidget extends StatelessWidget {
  const PastCareGiversLoadingWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
                      width: 35,
                      height: 35,
                      decoration: const BoxDecoration(
                        color: AppColors.benekWhite,
                        shape: BoxShape.circle,
                      ),
                    ),

                    Padding(
                      padding: const EdgeInsets.only(left: 15.0, top: 5.0),
                      child: Container(
                        width: 30,
                        height: 30,
                        decoration: const BoxDecoration(
                          color: AppColors.benekWhite,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(width: 10.0),

                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 15,
                          height: 15,
                          decoration: BoxDecoration(
                            color: AppColors.benekBlack,
                            borderRadius: BorderRadius.circular(2.0),
                          ),
                        ),
                        const SizedBox(width: 5),
                        Container(
                          width: 50,
                          height: 15,
                          decoration: BoxDecoration(
                            color: AppColors.benekBlack,
                            borderRadius: BorderRadius.circular(2.0),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 5),

                    Row(
                      children: [
                        Container(
                          width: 15,
                          height: 15,
                          decoration: BoxDecoration(
                            color: AppColors.benekBlack,
                            borderRadius: BorderRadius.circular(2.0),
                          ),
                        ),
                        const SizedBox(width: 5),
                        Container(
                          width: 40,
                          height: 15,
                          decoration: BoxDecoration(
                            color: AppColors.benekBlack,
                            borderRadius: BorderRadius.circular(2.0),
                          ),
                        ),
                      ],
                    ),
                  ],
                )
              ],
            ),
            Container(
              width: 70,
              height: 35,
              decoration: BoxDecoration(
                color: AppColors.benekBlack,
                borderRadius: BorderRadius.circular(2.0),
              ),
            ),
          ]
      ),
    );
  }
}