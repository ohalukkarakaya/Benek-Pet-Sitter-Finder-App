import 'package:benek/common/utils/styles.text.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../constants/app_colors.dart';
import '../constants/benek_icons.dart';
import '../utils/benek_string_helpers.dart';

class BenekCopyButton extends StatefulWidget {
  final double widthAndHeight;
  final String valueToCopy;
  final bool isLight;
  const BenekCopyButton({
    super.key,
    this.widthAndHeight = 40,
    required this.valueToCopy,
    this.isLight = false,
  });

  @override
  State<BenekCopyButton> createState() => _BenekCopyButtonState();
}

class _BenekCopyButtonState extends State<BenekCopyButton> {
  final ElTooltipController _tooltipController = ElTooltipController();
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElTooltip(
        color: AppColors.benekLightBlue,
        showModal: false,
        showChildAboveOverlay: false,
        position: ElTooltipPosition.bottomEnd,
        content:  Text(
            BenekStringHelpers.locale('copied'),
            style: mediumTextStyle()
        ),
        controller: _tooltipController,
        child: GestureDetector(
          onTap: () async {
            Clipboard.setData(ClipboardData(text: widget.valueToCopy));
            setState(() {
              _tooltipController.show();
            });
            await Future.delayed(const Duration(milliseconds: 500));
            setState(() {
              _tooltipController.hide();
            });
          },
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
              width: widget.widthAndHeight,
              height: widget.widthAndHeight,
              decoration: BoxDecoration(
                color: !isHovering
                    ? !widget.isLight
                      ? AppColors.benekBlackWithOpacity
                      : AppColors.benekWhite.withOpacity(0.1)
                    : AppColors.benekLightBlue,
                borderRadius: const BorderRadius.all(Radius.circular(6.0)),
              ),
              child: Center(
                child: Icon(
                  BenekIcons.copy,
                  color: !isHovering ? AppColors.benekWhite : AppColors.benekBlack,
                  size: 15,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
