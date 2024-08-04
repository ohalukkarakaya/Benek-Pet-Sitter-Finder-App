import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:shimmer/shimmer.dart';

import '../../../constants/app_colors.dart';

class CommentLoadingElement extends StatelessWidget {
  const CommentLoadingElement({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Shimmer.fromColors(
        baseColor: AppColors.benekWhite.withOpacity(0.5),
        highlightColor: AppColors.benekWhite.withOpacity(0.2),
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.all(Radius.circular(8.0)),
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LayoutBuilder(
                  builder: (context, constraints) {
                    return Stack(
                      children: [
                        Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 30.0,
                              height: 30.0,
                              decoration: BoxDecoration(
                                color: AppColors.benekWhite,
                                borderRadius: BorderRadius.circular(100.0),
                              )
                            ),
                            const SizedBox( height: 35 ),

                            SizedBox(
                              width: 30,
                              height: 30,
                              child: Stack(
                                children: [
                                  Positioned(
                                      right: 0,
                                      top: 0,
                                      child: Container(
                                        width: 30 / 2,
                                        height: 30 / 2,
                                        decoration: BoxDecoration(
                                          color: AppColors.benekWhite,
                                          borderRadius: BorderRadius.circular(100.0),
                                        )
                                      )
                                  ),

                                Positioned(
                                      left: 0,
                                      top: 30 / 2.7,
                                      child: Container(
                                        width: 30 / 2.3,
                                        height: 30 / 2.3,
                                        decoration: BoxDecoration(
                                          color: AppColors.benekWhite,
                                          borderRadius: BorderRadius.circular(100.0),
                                        )
                                      )
                                  ),

                                  Positioned(
                                      left: 30 / 2.0,
                                      bottom: 0,
                                      child: Container(
                                        width: 30 / 2.8,
                                        height: 30 / 2.8,
                                        decoration: BoxDecoration(
                                          color: AppColors.benekWhite,
                                          borderRadius: BorderRadius.circular(100.0),
                                        )
                                      )
                                  )
                                ],
                              ),
                            )
                          ],
                        ),
                        Positioned(
                          top: 40,
                          bottom: 40,
                          left: 15,
                          child: Container(
                            width: 1.0,
                            color: AppColors.benekWhite,
                            height: constraints.maxHeight,
                          ),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(width: 10.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            width: 50.0,
                            height: 10.0,
                            decoration: BoxDecoration(
                              color: AppColors.benekWhite,
                              borderRadius: BorderRadius.circular(6.0),
                            ),
                          ),
                          const SizedBox(width: 4.0),
                          Container(
                            width: 60.0,
                            height: 10.0,
                            decoration: BoxDecoration(
                              color: AppColors.benekWhite,
                              borderRadius: BorderRadius.circular(6.0),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10.0),
                      Container(
                        width: 400.0,
                        height: 10.0,
                        decoration: BoxDecoration(
                          color: AppColors.benekWhite,
                          borderRadius: BorderRadius.circular(6.0),
                        ),
                      ),
                      const SizedBox(height: 10.0),
                      Container(
                        width: 400.0,
                        height: 10.0,
                        decoration: BoxDecoration(
                          color: AppColors.benekWhite,
                          borderRadius: BorderRadius.circular(6.0),
                        ),
                      ),
                      const SizedBox(height: 15.0),
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.chat_bubble_outline,
                            color: AppColors.benekWhite,
                            size: 14,
                          ),
                          SizedBox(width: 15.0),
                          Icon(
                            Icons.favorite_border,
                            color: AppColors.benekWhite,
                            size: 15,
                          ),
                        ],
                      ),
                      const SizedBox(height: 10.0),
                      Container(
                        width: 60.0,
                        height: 10.0,
                        decoration: BoxDecoration(
                          color: AppColors.benekWhite,
                          borderRadius: BorderRadius.circular(6.0),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
