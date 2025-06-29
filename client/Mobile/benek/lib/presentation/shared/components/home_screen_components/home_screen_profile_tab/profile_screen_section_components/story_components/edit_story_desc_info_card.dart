import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';

class EditStoryDescInfoCard extends StatelessWidget {
  final bool isReady;
  final Color color;
  final Color darkColor;
  final Color textColor;

  const EditStoryDescInfoCard({
    super.key,
    this.isReady = false,
    this.color = AppColors.benekLightBlue,
    this.darkColor = AppColors.benekDarkBlue,
    this.textColor = AppColors.benekBlack,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20.0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6.0),
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(6.0),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Container(
                width: 5.0,
                height: 60.0,
                decoration: BoxDecoration( color: darkColor ),
              ),
              const SizedBox(width: 12.0),
              Icon(
                isReady ? BenekIcons.checkcircle : BenekIcons.timescircle,
                color: isReady ? AppColors.benekSuccessGreen : AppColors.benekWhite,
                size: 16.0,
              ),
              const SizedBox(width: 8.0),
              Text(
                BenekStringHelpers.locale('addDescriptionCaption'),
                style: mediumTextStyle( textColor: textColor ),
              ),
            ],
          )
        ),
      ),
    );
  }
}
