import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

class LocationWarningWidget extends StatelessWidget {
  const LocationWarningWidget({super.key});

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double containerWidth = screenWidth > 600 ? 500 : screenWidth * 0.9;
    double contentWidth = screenWidth > 600 ? 450 : screenWidth * 0.8;

    return Padding(
      padding: const EdgeInsets.only(top: 30.0, left: 20, right: 20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6.0),
        child: Container(
          width: containerWidth,
          constraints: const BoxConstraints(minHeight: 80, maxHeight: 80),
          color: AppColors.benekBlack.withAlpha((0.8 * 255).toInt()),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 5.0,
                height: 80.0,
                color: AppColors.benekWarningOrange,
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: SizedBox(
                    width: contentWidth,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(
                          Icons.warning_rounded,
                          color: AppColors.benekWarningOrange,
                        ),
                        const SizedBox(width: 10.0),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                BenekStringHelpers.locale('chooseYourLocationCaption'),
                                style: boldTextStyle(
                                  textColor: AppColors.benekWarningOrange,
                                  textFontSize: 14.0,
                                ),
                              ),
                              const SizedBox(height: 5.0),
                              Text(
                                BenekStringHelpers.locale('chooseYourLocationDesc'),
                                style: regularTextStyle(
                                  textColor: AppColors.benekWhite,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}