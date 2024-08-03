import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

class BenekHorizontalButton extends StatefulWidget {
  final String text;
  final double width;
  final double height;
  final Function()? onTap;
  const BenekHorizontalButton({
    super.key,
    required this.text,
    this.width = 230,
    this.height = 50,
    this.onTap
  });

  @override
  State<BenekHorizontalButton> createState() => _BenekHorizontalButtonState();
}

class _BenekHorizontalButtonState extends State<BenekHorizontalButton> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: MouseRegion(
        onHover: (event) {
          setState(() {
            isHovering = true;
          });
        },
        onExit: (event) {
          setState(() {
            isHovering = false;
          });
        },
        child: Container(
          width: widget.width,
          height: widget.height,
          padding: const EdgeInsets.symmetric(horizontal: 15.0),
          decoration: BoxDecoration(
            color: !isHovering ? AppColors.benekBlackWithOpacity : AppColors.benekLightBlue,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                widget.text,
                style: TextStyle(
                  fontFamily: defaultFontFamily(),
                  fontSize: 12.0,
                  color: !isHovering ? AppColors.benekWhite : AppColors.benekBlack,
                  fontWeight: getFontWeight('regular'),
                ),
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis
              ),
              Icon(
                BenekIcons.right,
                color: !isHovering ? AppColors.benekWhite : AppColors.benekBlack,
                size: 12.0
              )
            ],
          ),
        ),
      ),
    );
  }
}
