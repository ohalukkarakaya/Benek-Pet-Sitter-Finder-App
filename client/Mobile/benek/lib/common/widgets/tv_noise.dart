import 'package:flutter/material.dart';
import 'dart:math';
import 'dart:ui' as ui;

class TvNoise extends StatefulWidget {
  const TvNoise({super.key});

  @override
  State<TvNoise> createState() => _TvNoiseState();
}

class _TvNoiseState extends State<TvNoise> with SingleTickerProviderStateMixin {
  AnimationController? _controller;
  List<Offset>? _points;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 50),
      vsync: this,
    )..addListener(() {
      setState(() {
        _generatePoints();
      });
    })..repeat();
  }

  void _generatePoints() {
    final random = Random();
    final screenSize = MediaQuery.of(context).size;
    _points = List<Offset>.generate(150000, (index) {
      return Offset(
        random.nextDouble() * screenSize.width,
        random.nextDouble() * screenSize.height,
      );
    });
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_points == null) {
      _generatePoints();
    }
    return CustomPaint(
      painter: TvNoisePainter(_points!),
      child: Container(),
    );
  }
}

class TvNoisePainter extends CustomPainter {
  final List<Offset> points;

  TvNoisePainter(this.points);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 2.0;

    for (final point in points) {
      final colorValue = Random().nextInt(100);
      if (colorValue < 100) {
        // Siyah renk oranını artırmak için 20'den küçük değeri kontrol edin
        paint.color = Colors.black;
      } else {
        paint.color = Color.fromARGB(
          255,
          Random().nextInt(256),
          Random().nextInt(256),
          Random().nextInt(256),
        );
      }
      canvas.drawPoints(ui.PointMode.points, [point], paint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return true;
  }
}
