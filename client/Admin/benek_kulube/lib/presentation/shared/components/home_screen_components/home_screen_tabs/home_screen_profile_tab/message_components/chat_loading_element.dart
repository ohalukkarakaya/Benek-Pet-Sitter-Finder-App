import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class ChatLoadingElement extends StatelessWidget {
  const ChatLoadingElement({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Shimmer.fromColors(
          baseColor: AppColors.benekBlack.withOpacity(0.5),
          highlightColor: AppColors.benekBlack.withOpacity(0.2),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 35,
                height: 35,
                decoration: const BoxDecoration(
                  color: AppColors.benekWhite,
                  shape: BoxShape.circle,
                ),
              ),

              Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Container(
                        width: 40,
                        height: 15,
                        decoration: BoxDecoration(
                          color: AppColors.benekWhite,
                          borderRadius: BorderRadius.circular(2.0),
                        ),
                      ),
                      Container(
                        width: 110,
                        height: 15,
                        decoration: BoxDecoration(
                          color: AppColors.benekWhite,
                          borderRadius: BorderRadius.circular(2.0),
                        ),
                      )
                    ],
                  ),
                  Container(
                    width: 150,
                    height: 15,
                    decoration: BoxDecoration(
                      color: AppColors.benekWhite,
                      borderRadius: BorderRadius.circular(2.0),
                    ),
                  )
                ],
              ),
            ]
          )
      ),
    );
  }
}
