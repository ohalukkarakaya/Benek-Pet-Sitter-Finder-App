import 'dart:developer';

import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../constants/app_colors.dart';

class BenekSmallButton extends StatefulWidget {
  final IconData iconData;
  final Function()? onTap;
  final String? tooltipMessage;

  const BenekSmallButton({
    super.key,
    required this.iconData,
    this.onTap,
    this.tooltipMessage
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
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: isHovering ? AppColors.benekLightBlue : AppColors.benekBlackWithOpacity,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Center(
            child: Icon(
              widget.iconData,
              size: 20,
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
