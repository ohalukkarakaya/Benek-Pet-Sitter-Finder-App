import 'dart:ui';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:flutter/material.dart';

class BenekBluredModalBarier extends StatelessWidget {
  final Widget? child;
  final bool isLightColor;
  final bool isDismissible;
  final Function()? onDismiss;
  const BenekBluredModalBarier({super.key, this.child, this.isLightColor = false, this.isDismissible = false, this.onDismiss});

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        ModalBarrier(
          color: !isLightColor 
                    ? AppColors.benekBlack.withOpacity(0.5)
                    : Colors.grey.withOpacity(0.5),
          dismissible: isDismissible,
          onDismiss: onDismiss,
        ),
        BackdropFilter(
          blendMode: BlendMode.srcOver,
          filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0, tileMode: TileMode.clamp),
          child: child ?? const SizedBox(),
        )
      ],
    );
  }
}