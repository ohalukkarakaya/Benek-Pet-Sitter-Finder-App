import 'package:flutter/material.dart';
import 'package:flutter/material.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../../../../../../common/constants/app_colors.dart';

class EditProfileButton extends StatefulWidget {
  final void Function()? onTap;

  const EditProfileButton({
    super.key,
    this.onTap
  });

  @override
  State<EditProfileButton> createState() => _EditProfileButtonState();
}

class _EditProfileButtonState extends State<EditProfileButton> {
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
      child: GestureDetector(
        onTap: widget.onTap,
        child: Container(
            width: 25,
            height: 25,
            decoration: BoxDecoration(
              color: !isHovered ? AppColors.benekBlack : AppColors.benekLightBlue,
              borderRadius: const BorderRadius.all( Radius.circular( 100.0 ) ),
            ),
            child: Center(
              child: Icon(
                FontAwesomeIcons.gear,
                size: 10.0,
                color: !isHovered ? AppColors.benekWhite : AppColors.benekBlack,
              ),
            )
        ),
      ),
    );
  }
}
