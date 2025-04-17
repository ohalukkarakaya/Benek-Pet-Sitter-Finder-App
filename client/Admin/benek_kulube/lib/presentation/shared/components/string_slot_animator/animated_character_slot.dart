import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

class AnimatedCharacterSlot extends StatefulWidget {
  final String targetChar;
  final List<String> characters;
  final Duration duration;
  final TextStyle textStyle;

  const AnimatedCharacterSlot({
    required this.targetChar,
    required this.characters,
    required this.duration,
    required this.textStyle,
    super.key,
  });

  @override
  State<AnimatedCharacterSlot> createState() => _AnimatedCharacterSlotState();
}

class _AnimatedCharacterSlotState extends State<AnimatedCharacterSlot> {
  late String currentChar;
  late Timer _timer;
  late DateTime _startTime;
  bool _finished = false;

  @override
  void initState() {
    super.initState();
    currentChar = getRandomChar();
    _startTime = DateTime.now();

    _timer = Timer.periodic(const Duration(milliseconds: 50), (timer) {
      final elapsed = DateTime.now().difference(_startTime);

      if (elapsed >= widget.duration) {
        setState(() {
          currentChar = widget.targetChar.toUpperCase();
          _finished = true;
        });
        _timer.cancel();
      } else {
        setState(() {
          currentChar = getRandomChar();
        });
      }
    });
  }

  String getRandomChar() {
    final rand = Random();
    return widget.characters[rand.nextInt(widget.characters.length)];
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 30,
      child: Center(
        child: Text(
          currentChar,
          style: widget.textStyle,
        ),
      ),
    );
  }
}
