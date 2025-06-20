import 'package:flutter/material.dart';

import '../../constants/app_colors.dart';

class TrianglePainter extends CustomPainter {
  final Color color;

  TrianglePainter({ this.color = AppColors.benekWhite });

  @override
  void paint(Canvas canvas, Size size) {

    Path path_0 = Path();
    path_0.moveTo(size.width * 0.75, 0);
    path_0.lineTo(0,0);
    path_0.lineTo(0, size.height * 0.95);
    path_0.arcToPoint(
        Offset(size.width * 0.065, size.height * 0.95),
        radius: Radius.elliptical(size.width * 0.0365, size.width * 0.0365),
        rotation: 0,
        largeArc: false,
        clockwise: false
    );
    path_0.close();

    Paint paint_0_fill = Paint()..style=PaintingStyle.fill;
    paint_0_fill.color = color;
    canvas.drawPath(path_0,paint_0_fill);

  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}