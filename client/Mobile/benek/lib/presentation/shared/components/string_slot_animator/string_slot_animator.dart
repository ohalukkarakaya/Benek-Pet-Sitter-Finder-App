import 'package:flutter/material.dart';

import 'animated_character_slot.dart';

class StringSlotAnimator extends StatelessWidget {
  final String targetString;
  final List<String> characters;
  final Duration duration;
  final TextStyle textStyle;

  const StringSlotAnimator({
    required this.targetString,
    this.characters = const [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '?', ' '
    ],
    this.duration = const Duration(seconds: 2),
    this.textStyle = const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: targetString.split('').map((char) {
        return AnimatedCharacterSlot(
          targetChar: char,
          characters: characters,
          duration: duration,
          textStyle: textStyle,
        );
      }).toList(),
    );
  }
}