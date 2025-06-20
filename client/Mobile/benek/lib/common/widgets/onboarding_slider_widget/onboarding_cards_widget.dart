import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

class OnBoardingCardWidget extends StatelessWidget {
  final String title;
  final String subtitle;

  const OnBoardingCardWidget({
    super.key,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 32.0, horizontal: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
              style: boldTextStyle(
                  textColor: AppColors.benekWhite,
                  textFontSize: 20.0,
              )
          ),
          const SizedBox(height: 12),
          Text(subtitle,
              style: regularTextStyle(
                  textColor: AppColors.benekGrey,
                  textFontSize: 12.0,
              )
              ),
        ],
      ),
    );
  }
}
