import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/presentation/shared/components/benek_dashed_border/benek_dashed_border.dart';
import 'package:benek_kulube/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:flutter/material.dart';

class BenekLoadingComponent extends StatelessWidget {
  final double width;
  final double height;
  const BenekLoadingComponent({super.key, this.width = 100.0, this.height = 100.0});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: const BoxDecoration(
        color: AppColors.benekLightBlue,
        borderRadius: BorderRadius.all( Radius.circular( 20.0 ) )
      ),
      padding: const EdgeInsets.all(5),
      child: BenekDottedBorder(
        color: Colors.black,
        borderType: BorderType.RRect,
        radius: const Radius.circular(15.0),
        padding: const EdgeInsets.all(6),
        child: ClipRRect(
          borderRadius: const BorderRadius.all(Radius.circular(15.0)),
          child: Container(
            height: 200,
            width: 120,
            padding: const EdgeInsets.all(20.0),
            child: const BenekProcessIndicator(
              color: Colors.black,
            ),
          ),
        ),
      )
    );
  }
}