import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class BenekChip extends StatefulWidget {
  final String? text;
  final bool enableHoverEffect;
  final double opacity;
  final bool isActive;
  final bool isLight;
  final Color? textColor;

  const BenekChip({
    super.key,
    this.text,
    this.enableHoverEffect = true,
    this.opacity = 0.2,
    this.isActive = false,
    this.isLight = false,
    this.textColor,
  });

  @override
  State<BenekChip> createState() => _BenekChipState();
}

class _BenekChipState extends State<BenekChip> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return widget.text != null
      ? SizedBox(
        width: 170,
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
            decoration: BoxDecoration(
              color: !(widget.isActive ) && ( !isHovering || !(widget.enableHoverEffect) )
                        ? !(widget.isLight)
                              ? AppColors.benekBlack.withOpacity(widget.opacity)
                              : AppColors.benekLightBlue
                        : !(widget.isLight)
                              ? AppColors.benekLightBlue
                              : AppColors.benekBlack,
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
            ),
            padding: const EdgeInsets.all(17.0),
            child: Center(
              child: widget.text != null
                ? Text(
                  widget.text!,
                  style: TextStyle(
                    fontFamily: defaultFontFamily(),
                    fontSize: 12.0,
                    color: !(widget.isActive) && ( !isHovering || !(widget.enableHoverEffect) )
                        ? widget.textColor != null
                            ? widget.textColor
                            : !(widget.isLight)
                                  ? AppColors.benekWhite
                                  : AppColors.benekBlack
                            : AppColors.benekBlack,
                    fontWeight: !(widget.isActive) && !isHovering || !(widget.enableHoverEffect) ? getFontWeight('regular') : getFontWeight('semiBold'),
                  ),
                  overflow: TextOverflow.ellipsis,
                )
              : const SizedBox( height: 10,),
            ),
          ),
        ),
      )
      : Shimmer.fromColors(
        baseColor: AppColors.benekBlack.withOpacity(0.4),
        highlightColor: AppColors.benekBlack.withOpacity(0.2),
        child: Container(
          width: 170,
          height: 50,
          decoration: const BoxDecoration(
            color: AppColors.benekWhite,
            borderRadius: BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
        ),
      );
  }
}
