import 'package:flutter/widgets.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';

class DeactivateAccountButton extends StatefulWidget {
  const DeactivateAccountButton({super.key});

  @override
  State<DeactivateAccountButton> createState() => _DeactivateAccountButtonState();
}

class _DeactivateAccountButtonState extends State<DeactivateAccountButton> {
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
            color: !isHovering ? AppColors.benekBlack : AppColors.benekRed,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          padding: const EdgeInsets.all(10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                  BenekStringHelpers.locale('deactivateAccount'),
                  style: semiBoldTextStyle(
                    textColor: isHovering ? AppColors.benekWhite : AppColors.benekRed,
                  )
              ),

              const SizedBox(width: 5),

              Icon(
                Icons.logout,
                color: isHovering ? AppColors.benekWhite : AppColors.benekRed,
                size: 15,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
