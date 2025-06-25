import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/styles.text.dart';

class BenekHorizontalButton extends StatelessWidget {
  final String text;
  final double width;
  final double height;
  final bool isLight;
  final bool isPassive;
  final bool hasOutline;
  final Function()? onTap;

  const BenekHorizontalButton({
    super.key,
    required this.text,
    this.width = 230,
    this.height = 50,
    this.isLight = false,
    this.isPassive = false,
    this.hasOutline = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final backgroundColor = !isLight
        ? AppColors.benekBlackWithOpacity
        : AppColors.benekWhite.withAlpha(26);

    final textColor =
        isPassive ? AppColors.benekGrey : AppColors.benekWhite;

    return GestureDetector(
      onTap: isPassive ? null : onTap,
      child: Container(
        width: width,
        height: height,
        padding: const EdgeInsets.symmetric(horizontal: 15.0),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: const BorderRadius.all(Radius.circular(6.0)),
          border: hasOutline
              ? Border.all(
                  color: AppColors.benekLightBlue,
                  width: 1,
                )
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              text,
              style: TextStyle(
                fontFamily: defaultFontFamily(),
                fontSize: 12.0,
                color: textColor,
                fontWeight: getFontWeight('regular'),
              ),
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
            ),
            Icon(
              BenekIcons.right,
              color: textColor,
              size: 12.0,
            ),
          ],
        ),
      ),
    );
  }
}