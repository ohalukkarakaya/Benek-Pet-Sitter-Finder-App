import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';

class SeeUserLogsDetailedButton extends StatefulWidget {
  final double height;
  final double width;

  const SeeUserLogsDetailedButton({
    super.key,
    this.width = 350.0,
    this.height = 50.0,
  });

  @override
  State<SeeUserLogsDetailedButton> createState() => _SeeUserLogsDetailedButtonState();
}

class _SeeUserLogsDetailedButtonState extends State<SeeUserLogsDetailedButton> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only( bottom: 30.0, right: 40.0),
      child: MouseRegion(
          onEnter: (event) {
            setState(() {
              isHovering = true;
            });
          },
          onExit: (event) {
            setState(() {
              isHovering = false;
            });
          },
          child: Container(
            width: widget.width,
            height: widget.height,
            decoration: BoxDecoration(
              color: isHovering ? AppColors.benekLightBlue : AppColors.benekBlackWithOpacity,
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Center(
              child: Text(
                BenekStringHelpers.locale('seeUsersLogs'),
                style: TextStyle(
                  fontFamily: 'Qanelas',
                  fontSize: 12,
                  color: isHovering ? Colors.black : Colors.white,
                  fontWeight: isHovering ? FontWeight.w500 : FontWeight.w400,
                ),
              ),
            ),
          )
      ),
    );
  }
}
