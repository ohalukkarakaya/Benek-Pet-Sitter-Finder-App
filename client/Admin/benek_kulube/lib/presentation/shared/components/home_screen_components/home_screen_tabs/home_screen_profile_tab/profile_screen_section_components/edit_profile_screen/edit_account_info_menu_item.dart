import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../../common/utils/styles.text.dart';

class EditAccountInfoMenuItem extends StatefulWidget {
  final String text;
  final String? desc;
  final IconData icon;
  final Function()? onTap;

  const EditAccountInfoMenuItem({
    super.key,
    required this.text,
    this.desc,
    required this.icon,
    this.onTap,
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
        onTap: widget.onTap,
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
                    size: 25,
                  ),
                  const SizedBox(width: 20),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      widget.desc != null
                          ? Text(
                              '${widget.desc!} : ',
                              style: semiBoldTextStyle(
                                textColor: didHover ? AppColors.benekAirForceBlue : AppColors.benekLightBlue,
                                textFontSize: 10.0,
                              )
                          )
                          : const SizedBox(),

                      SizedBox( height: widget.desc != null ? 5.0 : 0.0, ),

                      Text(
                          widget.text,
                          style: semiBoldTextStyle(
                            textColor: didHover ? AppColors.benekBlack : AppColors.benekWhite,
                            textFontSize: 14.0,
                          )
                      ),
                    ],
                  ),
                ],
              ),
              Icon(
                BenekIcons.right,
                color: didHover ? AppColors.benekBlack : AppColors.benekWhite,
                size: 15,
              ),
            ],
          ),
        )
      ),
    );
  }
}
