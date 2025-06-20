import 'dart:ui';
import 'package:benek/common/widgets/video_bg_widget/background_video_widget.dart';
import 'package:flutter/material.dart';

class VideoBgWidget extends StatelessWidget {
  final double blurAmount;
  final double opacity;

  const VideoBgWidget({
    super.key,
    this.blurAmount = 20,
    this.opacity = 0.3,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        const BackgroundVideoWidget(),
        // Arka plan bulanıklığı
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blurAmount, sigmaY: blurAmount),
          child: Container(
            color: Colors.black.withOpacity(opacity),
          ),
        ),
        // Hafif kenarlık efekti (isteğe bağlı)
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.white.withOpacity(0.05)),
            color: Colors.transparent,
          ),
        ),
      ],
    );
  }
}
