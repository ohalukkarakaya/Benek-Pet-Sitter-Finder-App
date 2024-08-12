import 'dart:developer';

import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../constants/app_colors.dart';

class BenekSmallButton extends StatefulWidget {
  final IconData iconData;
  final Function()? onTap;
  final double iconSize;
  final bool isLight;
  final String? tooltipMessage;
  final double size;

  const BenekSmallButton({
    super.key,
    required this.iconData,
    this.onTap,
    this.iconSize = 20,
    this.isLight = false,
    this.tooltipMessage,
    this.size = 50,
  });

  @override
  State<BenekSmallButton> createState() => _BenekSmallButtonState();
}

class _BenekSmallButtonState extends State<BenekSmallButton> {
  final ElTooltipController _tooltipController = ElTooltipController();
  bool isHovering = false;

  Widget _buildChildWidget(){
    return GestureDetector(
      onTap: widget.tooltipMessage == null
          ? widget.onTap
          : null,
      child: MouseRegion(
        onHover: (event) {
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
          width: widget.size,
          height: widget.size,
          decoration: BoxDecoration(
            color: isHovering
                ? AppColors.benekLightBlue
                : !widget.isLight
                    ? AppColors.benekBlackWithOpacity
                    : AppColors.benekWhite.withOpacity(0.1),
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Center(
            child: Icon(
              widget.iconData,
              size: widget.iconSize,
              color: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
            )
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: widget.tooltipMessage != null
      ? ElTooltip(
          color: AppColors.benekLightBlue,
          showModal: false,
          showChildAboveOverlay: false,
          position: ElTooltipPosition.topStart,
          content:  Text(
              widget.tooltipMessage!,
              style: mediumTextStyle()
          ),
        controller: _tooltipController,
        child: GestureDetector(
            onTap: () async {
              await widget.onTap?.call();

              await _tooltipController.show();
              await Future.delayed(const Duration(milliseconds: 500));
              await _tooltipController.hide();
            },
            child: _buildChildWidget()
        ),
      )
      : _buildChildWidget()
    );
  }
}
