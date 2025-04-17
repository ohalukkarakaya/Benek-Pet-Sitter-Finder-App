import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:benek_kulube/common/constants/app_colors.dart';

class ReportContextLoadingWidget extends StatelessWidget {
  final double width;
  final double height;

  const ReportContextLoadingWidget({
    super.key,
    required this.width,
    required this.height,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Shimmer.fromColors(
        baseColor: AppColors.benekWhite.withOpacity(0.1),
        highlightColor: AppColors.benekWhite.withOpacity(0.05),
        child: Column(
          children: [
            // MISSION DESC
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: AppColors.benekWhite.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 30,
                        height: 30,
                        decoration: const BoxDecoration(
                          color: AppColors.benekWhite,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Container(
                        width: 250,
                        height: 12,
                        decoration: BoxDecoration(
                          color: AppColors.benekWhite,
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    width: 140,
                    height: 18,
                    decoration: BoxDecoration(
                      color: AppColors.benekWhite,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    width: 120,
                    height: 12,
                    decoration: BoxDecoration(
                      color: AppColors.benekWhite,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                ],
              ),
            ),

            // REPORT DESC
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.benekWarningOrange, width: 1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Row(
                children: [
                  Container(
                    width: 30,
                    height: 30,
                    decoration: const BoxDecoration(
                      color: AppColors.benekWhite,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Container(
                      height: 12,
                      decoration: BoxDecoration(
                        color: AppColors.benekBlack,
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // EXCUSE INPUT
            Container(
              width: double.infinity,
              constraints: const BoxConstraints(minHeight: 150, maxHeight: 250),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.benekBlack.withOpacity(0.05),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    height: 145,
                    decoration: BoxDecoration(
                      color: AppColors.benekBlack,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: AppColors.benekWhite,
                          borderRadius: BorderRadius.circular(100),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}