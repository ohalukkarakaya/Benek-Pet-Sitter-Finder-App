import 'package:flutter/material.dart';
import 'package:flutter/material.dart';


import '../../../../../../../../common/constants/app_colors.dart';

class EditBioButton extends StatefulWidget {
  final Function()? onTap;
  const EditBioButton({
    super.key,
    this.onTap,
  });

  @override
  State<EditBioButton> createState() => _EditBioButtonState();
}

class _EditBioButtonState extends State<EditBioButton> {
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
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            color: !isHovered ? AppColors.benekWhite.withOpacity(0.1) : AppColors.benekLightBlue,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Center(
            child: Icon(
              Icons.edit,
              color: isHovered ? AppColors.benekBlack : AppColors.benekWhite,
              size: 15,
            ),
          ),
        ),
      ),
    );
  }
}
