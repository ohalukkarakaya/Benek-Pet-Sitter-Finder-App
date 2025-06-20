import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/presentation/shared/components/benek_dashed_border/benek_dashed_border.dart';
import 'package:benek/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:flutter/material.dart';

class BenekLoadingComponent extends StatelessWidget {
  final double width;
  final double height;
  final bool isDark;
  const BenekLoadingComponent(
    {
      super.key, 
      this.width = 100.0, 
      this.height = 100.0,
      this.isDark = false
    }
  );

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: isDark ? AppColors.benekBlack : AppColors.benekLightBlue,
        borderRadius: const BorderRadius.all( Radius.circular( 20.0 ) )
      ),
      padding: EdgeInsets.all( isDark ? 10 : 5),
      child: BenekDottedBorder(
        color: isDark ? AppColors.benekWhite : Colors.black,
        borderType: BorderType.RRect,
        radius: const Radius.circular(15.0),
        padding: const EdgeInsets.all(6),
        child: Center(
          child: BenekProcessIndicator(
            color: isDark ? AppColors.benekWhite : Colors.black,
            width: width / 2.5,
            height: height / 2.5,
          ),
        ),
      )
    );
  }
}