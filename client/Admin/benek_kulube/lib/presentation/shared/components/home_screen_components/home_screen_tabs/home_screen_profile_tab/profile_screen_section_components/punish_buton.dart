import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class PunishUserButton extends StatefulWidget {
  final bool isActive;
  const PunishUserButton({
    super.key,
    this.isActive = false,
  });

  @override
  State<PunishUserButton> createState() => _PunishUserButtonState();
}

class _PunishUserButtonState extends State<PunishUserButton> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
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
      child: Container(
        width: 150,
        height: 50,
        decoration: BoxDecoration(
          color: widget.isActive && isHovering ? AppColors.benekBlack.withOpacity(0.5) : AppColors.benekBlackWithOpacity,
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        padding: const EdgeInsets.all(10.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.block,
              color: widget.isActive ? AppColors.benekWhite : AppColors.benekBlack,
            ),
            const SizedBox(width: 5),
            Text(
              BenekStringHelpers.locale('punishUser'),
              style: semiBoldTextStyle(
                textColor: widget.isActive ? AppColors.benekWhite : AppColors.benekBlack,
              )
            ),
          ],
        ),
      ),
    );
  }
}
