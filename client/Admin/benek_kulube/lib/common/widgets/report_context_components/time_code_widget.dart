import 'package:flutter/material.dart';

import '../../../presentation/shared/components/string_slot_animator/string_slot_animator.dart';
import '../../constants/app_colors.dart';

class TimeCodeWidget extends StatelessWidget {
  final String code;
  final double width;
  final double height;
  final TextStyle? textStyle;
  final Duration duration;
  final Color backgroundColor;

  const TimeCodeWidget({
    super.key,
    required this.code,
    this.width = 350.0,
    this.height = 60.0,
    this.textStyle,
    this.duration = const Duration(seconds: 2),
    this.backgroundColor = AppColors.benekLightBlue,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(6.0),
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: backgroundColor,
        ),
        child: Center(
          child: StringSlotAnimator(
            targetString: code,
            duration: duration,
            textStyle: textStyle ??
                const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
          ),
        ),
      ),
    );
  }
}