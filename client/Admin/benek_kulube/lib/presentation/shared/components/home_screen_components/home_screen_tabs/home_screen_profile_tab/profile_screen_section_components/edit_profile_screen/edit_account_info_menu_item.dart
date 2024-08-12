import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../../common/utils/styles.text.dart';

class EditAccountInfoMenuItem extends StatefulWidget {
  final String text;
  final IconData icon;

  const EditAccountInfoMenuItem({
    super.key,
    required this.text,
    required this.icon,
  });

  @override
  State<EditAccountInfoMenuItem> createState() => _EditAccountInfoMenuItemState();
}

class _EditAccountInfoMenuItemState extends State<EditAccountInfoMenuItem> {
  bool didHover = false;
  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) {
        setState(() {
          didHover = true;
        });
      },
      onExit: (_) {
        setState(() {
          didHover = false;
        });
      },
      child: GestureDetector(
        onTap: () {},
        child: Container(
          padding: const EdgeInsets.all(15.0),
          decoration: BoxDecoration(
            color: !didHover ? AppColors.benekBlack : AppColors.benekLightBlue,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Icon(
                    widget.icon,
                    color: didHover ? AppColors.benekBlack : AppColors.benekWhite,
                    size: 20,
                  ),
                  const SizedBox(width: 20),
                  Text(
                      widget.text,
                      style: semiBoldTextStyle(
                        textColor: didHover ? AppColors.benekBlack : AppColors.benekWhite,
                      )
                  ),
                ],
              ),
              Icon(
                Icons.edit,
                color: didHover ? AppColors.benekBlack : AppColors.benekWhite,
                size: 20,
              ),
            ],
          ),
        )
      ),
    );
  }
}
