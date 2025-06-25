import 'dart:ui';

extension HexColor on Color {
  int _to255(double component) => (component * 255.0).round() & 0xff;

  String _generateAlpha({required bool withAlpha}) {
    return withAlpha ? _to255(a).toRadixString(16).padLeft(2, '0') : '';
  }

  String toHex({bool leadingHashSign = false, bool withAlpha = false}) =>
      '${leadingHashSign ? '#' : ''}'
      '${_generateAlpha(withAlpha: withAlpha)}'
      '${_to255(r).toRadixString(16).padLeft(2, '0')}'
      '${_to255(g).toRadixString(16).padLeft(2, '0')}'
      '${_to255(b).toRadixString(16).padLeft(2, '0')}'
      .toUpperCase();
}