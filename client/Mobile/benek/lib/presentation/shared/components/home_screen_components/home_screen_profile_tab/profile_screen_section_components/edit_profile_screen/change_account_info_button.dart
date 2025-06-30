import 'package:flutter/material.dart';

import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';

import '../../../../../../../../common/constants/app_colors.dart';

class ChangeAccountInfoButton extends StatefulWidget {
  const ChangeAccountInfoButton({super.key});

  @override
  State<ChangeAccountInfoButton> createState() => _ChangeAccountInfoButtonState();
}

class _ChangeAccountInfoButtonState extends State<ChangeAccountInfoButton> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) {
          setState(() {
            isHovering = true;
          });
        },
        onExit: (_) {
          setState(() {
          isHovering = false;
          });
        },
        child: GestureDetector(
          onTap: () {},
          child: Container(
            width: 150,
            height: 50,
            decoration: BoxDecoration(
              color: !isHovering ? AppColors.benekBlack : AppColors.benekLightBlue,
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
            ),
            padding: const EdgeInsets.all(10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                    BenekStringHelpers.locale('accountInfo'),
                    style: semiBoldTextStyle(
                      textColor: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                    )
                ),

                const SizedBox(width: 5),

                Icon(
                  Icons.settings,
                  color: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                  size: 15,
                ),
              ],
            ),
          ),
        ),
    );
  }
}
