import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class BenekProfileStarDetailInfoCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final double width;

  const BenekProfileStarDetailInfoCard({
    super.key,
    required this.icon,
    required this.title,
    required this.value,
    this.width = 250,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(9),
        color:  AppColors.benekBlack.withOpacity(0.6),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.benekLightBlue,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Icon(
                icon,
                color: AppColors.benekBlack,
              ),
            ),
            const SizedBox(width: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.benekGrey,
                    fontSize: 12,
                    fontWeight: FontWeight.w300
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  value,
                  style: const TextStyle(
                    color: AppColors.benekWhite,
                    fontSize: 16,
                    fontWeight: FontWeight.bold
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
