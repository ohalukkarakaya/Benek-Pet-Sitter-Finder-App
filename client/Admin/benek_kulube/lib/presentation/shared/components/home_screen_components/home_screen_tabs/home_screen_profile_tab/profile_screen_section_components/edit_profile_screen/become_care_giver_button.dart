import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';

class BecomeCareGiverButton extends StatefulWidget {
  const BecomeCareGiverButton({super.key});

  @override
  State<BecomeCareGiverButton> createState() => _BecomeCareGiverButtonState();
}

class _BecomeCareGiverButtonState extends State<BecomeCareGiverButton> {
  bool isHovered = false;
  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onHover: (event) {
        setState(() {
          isHovered = true;
        });
      },
      onExit: (event) {
        setState(() {
          isHovered = false;
        });
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6.0),
        child: Container(
          height: 90,
          decoration: BoxDecoration(
            color: !isHovered ? AppColors.benekBlack : AppColors.benekLightBlue,
            borderRadius: const BorderRadius.all(Radius.circular(6.0)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                    width: 5,
                    height: 90,
                    color: AppColors.benekWarningOrange,
                  ),
                  const SizedBox(width: 20.0,),
                  const Icon(
                    Icons.warning_rounded,
                    color: AppColors.benekWarningOrange,
                    size: 40,
                  ),
                  const SizedBox(width: 20.0,),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        BenekStringHelpers.locale('youRNotACareGiverYet'),
                        style: semiBoldTextStyle(
                          textColor: AppColors.benekWarningOrange,
                        ),
                      ),
                      const SizedBox(height: 5.0,),
                      Text(
                        BenekStringHelpers.locale('becomeACareGiverInfo'),
                        style: regularTextStyle(
                          textColor: !isHovered ? AppColors.benekWhite : AppColors.benekBlack,
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Padding(
                    padding: EdgeInsets.only( right: 30.0 , bottom: 30.0 ),
                    child: Icon(
                      BenekIcons.right,
                      color: !isHovered ? AppColors.benekWhite : AppColors.benekBlack,
                      size: 17,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
