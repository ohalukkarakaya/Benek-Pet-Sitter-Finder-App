import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/styles.text.dart';

class BenekTextField extends StatelessWidget {
  final String hintText;
  final bool obscureText;
  final TextEditingController? controller;
  final TextInputType keyboardType;

  const BenekTextField({
    super.key,
    required this.hintText,
    this.obscureText = false,
    this.controller,
    this.keyboardType = TextInputType.text,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: TextStyle(
        fontFamily: defaultFontFamily(),
        fontSize: 14,
        color: AppColors.benekWhite,
        fontWeight: getFontWeight('regular'),
      ),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(
          fontFamily: defaultFontFamily(),
          fontSize: 14,
          color: AppColors.benekWhite.withOpacity(0.4),
          fontWeight: getFontWeight('regular'),
        ),
        filled: true,
        fillColor: AppColors.benekWhite.withOpacity(0.1), // isLight: true stili
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
