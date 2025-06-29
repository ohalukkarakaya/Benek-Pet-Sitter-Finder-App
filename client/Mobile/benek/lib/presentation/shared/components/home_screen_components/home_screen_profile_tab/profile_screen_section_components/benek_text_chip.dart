import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import 'benek_chip.dart';

class BenekTextChip extends StatefulWidget {
  final bool enableHoverEffect;
  final bool shouldCopyOnTap;
  final Function()? onTap;
  final String? text;
  final double opacity;
  final bool isActive;
  final bool isLight;
  final Color? textColor;

  const BenekTextChip({
    super.key,
    this.enableHoverEffect = false,
    this.shouldCopyOnTap = true,
    this.onTap,
    this.text,
    this.opacity = 0.2,
    this.isActive = false,
    this.isLight = false,
    this.textColor,
  });

  @override
  State<BenekTextChip> createState() => _BenekTextChipState();
}

class _BenekTextChipState extends State<BenekTextChip> {
  final ElTooltipController _tooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElTooltip(
        color: AppColors.benekLightBlue,
        showModal: false,
        showChildAboveOverlay: false,
        position: ElTooltipPosition.bottomCenter,
        content:  Text(
            BenekStringHelpers.locale('copied'),
            style: mediumTextStyle()
        ),
        controller: _tooltipController,
        child: GestureDetector(
          onTap: () async {
            if(widget.shouldCopyOnTap && widget.text != null){
              Clipboard.setData(ClipboardData(text: widget.text!));
              setState(() {
                _tooltipController.show();
              });
            }
            await Future.delayed(const Duration(milliseconds: 500));
            setState(() {
              _tooltipController.hide();
            });

            if(widget.onTap != null){
              widget.onTap!();
            }
          },
          child: BenekChip(
            text: widget.text,
            enableHoverEffect: widget.enableHoverEffect,
            opacity: widget.opacity,
            isActive: widget.isActive,
            textColor: widget.textColor,
            isLight: widget.isLight,
          ),
          )
        ),
      );
  }
}
