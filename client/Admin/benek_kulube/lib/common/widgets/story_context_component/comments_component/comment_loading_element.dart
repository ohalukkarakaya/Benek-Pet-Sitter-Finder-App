import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:shimmer/shimmer.dart';

import '../../../constants/app_colors.dart';

class CommentLoadingElement extends StatelessWidget {
  const CommentLoadingElement({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Shimmer.fromColors(
        baseColor: AppColors.benekWhite.withOpacity(0.5),
        highlightColor: AppColors.benekWhite.withOpacity(0.2),
        child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 30,
                    height: 30,
                    decoration: const BoxDecoration(
                      color: AppColors.benekBlack,
                      shape: BoxShape.circle,
                    ),
                  ),

                  const SizedBox(width: 10.0),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 70,
                        height: 10,
                        decoration: BoxDecoration(
                          color: AppColors.benekBlack,
                          borderRadius: BorderRadius.circular(2.0),
                        ),
                      ),

                      const SizedBox(height: 5),

                      Container(
                        width: 120,
                        height: 10,
                        decoration: BoxDecoration(
                          color: AppColors.benekBlack,
                          borderRadius: BorderRadius.circular(2.0),
                        ),
                      ),

                      const SizedBox(height: 5),

                      Container(
                        width: 100,
                        height: 10,
                        decoration: BoxDecoration(
                          color: AppColors.benekBlack,
                          borderRadius: BorderRadius.circular(2.0),
                        ),
                      ),
                    ],
                  )
                ],
              ),

              const Icon(
                Icons.favorite,
                color: AppColors.benekGrey,
                size: 20,
              )
            ]
        ),
      ),
    );
  }
}
