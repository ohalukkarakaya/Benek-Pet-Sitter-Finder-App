import 'package:benek/common/constants/app_colors.dart';
import 'package:flutter/material.dart';
import 'benek_message_box_triangle_painter.dart';

class Triangle extends StatelessWidget {

  final Color color;

  Triangle({
    super.key,
    Color? color,
  }) : color = color ?? AppColors.benekBlack.withOpacity(0.2);
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: TrianglePainter( color: color ),
      size: const Size(50, 50),
    );
  }
}
