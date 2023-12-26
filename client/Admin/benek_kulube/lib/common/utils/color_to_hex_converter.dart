import 'dart:ui';

String colorToHex(Color color) {
  // Color nesnesinin değerini al
  int value = color.value;

  // 0xFFFFFFFF ile and işlemi yaparak alpha kanalını temizle
  value = value & 0xFFFFFFFF;

  // value'yu hex formata çevir
  String hexCode = value.toRadixString(16).toUpperCase().padLeft(8, '0');

  return hexCode;
}