import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../../../../common/constants/benek_icons.dart';

class BenekProfileStarWidget extends StatefulWidget {
  final int star;
  final int starCount;
  const BenekProfileStarWidget({
    super.key,
    this.star = 0,
    this.starCount = 0
  });

  @override
  State<BenekProfileStarWidget> createState() => _BenekProfileStarWidgetState();
}

class _BenekProfileStarWidgetState extends State<BenekProfileStarWidget> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) {
        setState(() {
          isHovering = true;
        });
      },
      onExit: (_) {
        setState(() {
          isHovering = false;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(10.0),
        decoration: BoxDecoration(
          color: isHovering ? AppColors.benekBlack.withOpacity(0.4) : AppColors.benekBlackWithOpacity,
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(
                    5,
                    (index){
                      return Padding(
                        padding: const EdgeInsets.all(5.0),
                        child: Icon(
                          Icons.star,
                          color: index < widget.star
                              ? AppColors.benekWhite
                              : AppColors.benekBlack,
                          size: 20,
                        ),
                      );
                    }
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(5.0),
              child: Text(
                "|  ${NumberFormat.compact().format(widget.starCount)}",
                style: planeTextWithoutWeightStyle(
                  textFontSize: 15,
                  textColor: AppColors.benekWhite
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
