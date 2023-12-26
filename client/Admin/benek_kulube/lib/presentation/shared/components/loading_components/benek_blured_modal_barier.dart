import 'dart:ui';

import 'package:flutter/material.dart';

class BenekBluredModalBarier extends StatelessWidget {
  final Widget? child;
  final bool isLightColor;
  const BenekBluredModalBarier({super.key, this.child, this.isLightColor = false});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ModalBarrier(
          color: !isLightColor 
                    ? Colors.black.withOpacity(0.5) 
                    : Colors.grey.withOpacity(0.5),
          dismissible: false,
        ),
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 5.0),
          child: child != null 
                  ? Center(child: child)
                  : const SizedBox(),
        )
      ],
    );
  }
}