import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class BenekChip extends StatefulWidget {
  final String? text;
  const BenekChip({super.key, this.text});

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
              color: !isHovering ? AppColors.benekBlack.withOpacity(0.2) : AppColors.benekLightBlue,
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
            ),
            padding: const EdgeInsets.all(17.0),
            child: Center(
              child: widget.text != null
                ? Text(
                  widget.text!,
                  style: TextStyle(
                    fontFamily: 'Qanelas',
                    fontSize: 12.0,
                    color: !isHovering ? AppColors.benekWhite : AppColors.benekBlack,
                    fontWeight: !isHovering ? FontWeight.w400 : FontWeight.w600,
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
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
        ),
      );
  }
}
