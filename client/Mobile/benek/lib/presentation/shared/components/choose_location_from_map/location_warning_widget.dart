import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class LocationWarningWidget extends StatelessWidget {
  const LocationWarningWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final boxWidth = screenWidth > 380 ? 360.0 : screenWidth - 40.0;

    return Align(
      alignment: Alignment.topCenter,
      child: Padding(
        padding: const EdgeInsets.only(top: 20.0),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8.0),
          child: Container(
            width: boxWidth,
            padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
            color: AppColors.benekBlack.withAlpha(217),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 4.0,
                  height: 40.0,
                  color: AppColors.benekWarningOrange,
                ),
                const SizedBox(width: 10.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        BenekStringHelpers.locale('chooseYourLocationCaption'),
                        style: boldTextStyle(
                          textColor: AppColors.benekWarningOrange,
                          textFontSize: 14.0,
                        ),
                      ),
                      const SizedBox(height: 4.0),
                      Text(
                        BenekStringHelpers.locale('chooseYourLocationDesc'),
                        style: regularTextStyle(
                          textColor: AppColors.benekWhite,
                          textFontSize: 12.0,
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

