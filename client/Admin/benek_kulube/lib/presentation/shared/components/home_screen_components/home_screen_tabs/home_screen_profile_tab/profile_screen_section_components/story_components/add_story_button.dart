import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';

class AddStoryButton extends StatefulWidget {
  final void Function() createStoryPageBuilderFunction;
  const AddStoryButton({
    super.key,
    required this.createStoryPageBuilderFunction,
  });

  @override
  State<AddStoryButton> createState() => _AddStoryButtonState();
}

class _AddStoryButtonState extends State<AddStoryButton> {
  bool isHovered = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all( 8.0 ),
      child: GestureDetector(
        onTap: () => widget.createStoryPageBuilderFunction.call(),
        child: ClipRRect(
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          child: MouseRegion(
            onHover: (_) {
              setState(() {
                isHovered = true;
              });
            },
            onExit: (_) {
              setState(() {
                isHovered = false;
              });
            },
            child: Container(
              width: 125,
              height: 250,
              decoration: BoxDecoration(
                color: !isHovered ? AppColors.benekBlackWithOpacity : AppColors.benekBlack,
                borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
              ),
              child: const Center(
                child: Icon(
                  BenekIcons.plussquare,
                  color: AppColors.benekWhite,
                  size: 30,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
