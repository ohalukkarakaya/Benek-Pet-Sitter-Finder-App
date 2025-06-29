import 'package:flutter/material.dart';


import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';

class AddStoryButton extends StatelessWidget {
  final void Function() createStoryPageBuilderFunction;
  const AddStoryButton({
    super.key,
    required this.createStoryPageBuilderFunction,
  });

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.of(context).size.width * 0.3;
    final double height = MediaQuery.of(context).size.height * 0.25;

    return GestureDetector(
      onTap: () => createStoryPageBuilderFunction(),
      child: Container(
        width: width,
        height: height,
        margin: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlackWithOpacity,
          borderRadius: BorderRadius.circular(8.0),
        ),
        child: const Center(
          child: Icon(
            BenekIcons.plussquare,
            color: AppColors.benekWhite,
            size: 30,
          ),
        ),
      ),
    );
  }
}