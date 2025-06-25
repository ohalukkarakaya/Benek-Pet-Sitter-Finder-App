import 'package:flutter/material.dart';

import '../constants/app_colors.dart';

class BenekSmallButton extends StatefulWidget {
  final IconData iconData;
  final Function()? onTap;
  final double iconSize;
  final bool isLight;
  final bool isPassive;
  final String? tooltipMessage;
  final double size;

  const BenekSmallButton({
    super.key,
    required this.iconData,
    this.onTap,
    this.iconSize = 20,
    this.isLight = false,
    this.isPassive = false,
    this.tooltipMessage,
    this.size = 50,
  });

  @override
  State<BenekSmallButton> createState() => _BenekSmallButtonState();
}

class _BenekSmallButtonState extends State<BenekSmallButton> {
  bool isHovering = false;

  Widget _buildChildWidget(){
    return GestureDetector(
      onTap: !widget.isPassive
          ? widget.onTap
          : (){},
      child: MouseRegion(
        cursor: !widget.isPassive ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onHover: (event) {
          if( !widget.isPassive ) {
            setState(() {
              isHovering = true;
            });
          }
        },
        onExit: (event) {
          setState(() {
            isHovering = false;
          });
        },
        child: Container(
          width: widget.size,
          height: widget.size,
          decoration: BoxDecoration(
            color: isHovering
              && !widget.isPassive
                ? AppColors.benekLightBlue
                : !widget.isLight
                    ? AppColors.benekBlackWithOpacity
                    : AppColors.benekWhite.withAlpha(26),
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Center(
            child: Icon(
              widget.iconData,
              size: widget.iconSize,
              color: widget.isPassive
                ? AppColors.benekGrey
                : isHovering
                  ? AppColors.benekBlack
                  : AppColors.benekWhite,
            )
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: _buildChildWidget(),
    );
  }
}
