import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class PunishmentCardLoadingElement extends StatelessWidget {
  const PunishmentCardLoadingElement({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Shimmer.fromColors(
        baseColor: AppColors.benekWhite.withOpacity(0.5),
        highlightColor: AppColors.benekWhite.withOpacity(0.2),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar placeholder
              Container(
                width: 40.0,
                height: 40.0,
                decoration: BoxDecoration(
                  color: AppColors.benekWhite,
                  borderRadius: BorderRadius.circular(100.0),
                ),
              ),
              const SizedBox(width: 12.0),
              // Text content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // First row: name and date
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Name
                        Container(
                          width: 80.0,
                          height: 12.0,
                          decoration: BoxDecoration(
                            color: AppColors.benekWhite,
                            borderRadius: BorderRadius.circular(6.0),
                          ),
                        ),
                        // Date
                        Container(
                          width: 40.0,
                          height: 10.0,
                          decoration: BoxDecoration(
                            color: AppColors.benekWhite,
                            borderRadius: BorderRadius.circular(6.0),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4.0),
                    // Full name
                    Container(
                      width: 120.0,
                      height: 10.0,
                      decoration: BoxDecoration(
                        color: AppColors.benekWhite,
                        borderRadius: BorderRadius.circular(6.0),
                      ),
                    ),
                    const SizedBox(height: 15.0),
                    // Admin description (2 lines)
                    Container(
                      width: double.infinity,
                      height: 10.0,
                      decoration: BoxDecoration(
                        color: AppColors.benekWhite,
                        borderRadius: BorderRadius.circular(6.0),
                      ),
                    ),
                    const SizedBox(height: 8.0),
                    Container(
                      width: double.infinity,
                      height: 10.0,
                      decoration: BoxDecoration(
                        color: AppColors.benekWhite,
                        borderRadius: BorderRadius.circular(6.0),
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}