import 'package:benek/common/utils/styles.text.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import 'edit_user_auth_screen/edit_user_auth_screen.dart';

class ProfileCardAdditionButton extends StatefulWidget {
  final String hoveringText;
  final IconData iconData;
  final double angle;

  const ProfileCardAdditionButton({
    super.key,
    required this.hoveringText,
    required this.iconData,
    this.angle = 0,
  });

  @override
  State<ProfileCardAdditionButton> createState() => _ProfileCardAdditionButtonState();
}

class _ProfileCardAdditionButtonState extends State<ProfileCardAdditionButton> {
  final ElTooltipController _tooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElTooltip(
        color: AppColors.benekBlack,
        showModal: false,
        showChildAboveOverlay: false,
        position: ElTooltipPosition.bottomCenter,
        content:  Text(
            widget.hoveringText,
            style: mediumTextStyle( textColor: AppColors.benekWhite ),
        ),
        controller: _tooltipController,
        child: GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              PageRouteBuilder(
                opaque: false,
                barrierDismissible: false,
                pageBuilder: (context, _, __) => const EditUserAuthScreen(),
              ),
            );
          },
          child: MouseRegion(
            cursor: SystemMouseCursors.click,
            onHover: (event) {
              setState(() {
                if( _tooltipController.value != ElTooltipStatus.showing ){
                  _tooltipController.show();
                }
              });
            },
            onExit: (event) {
              setState(() {
                if( _tooltipController.value != ElTooltipStatus.hidden ){
                  _tooltipController.hide();
                }
              });
            },
            child: Container(
              decoration: BoxDecoration(
                color: _tooltipController.value != ElTooltipStatus.showing
                    ? AppColors.benekBlackWithOpacity
                    : AppColors.benekBlack.withOpacity(0.5),
                borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 15),
              child: Transform.rotate(
                angle: widget.angle,
                child: Icon(
                  widget.iconData,
                  color: AppColors.benekWhite,
                ),
            ),
          ),
                ),
        ),
      ),
    );
  }
}
