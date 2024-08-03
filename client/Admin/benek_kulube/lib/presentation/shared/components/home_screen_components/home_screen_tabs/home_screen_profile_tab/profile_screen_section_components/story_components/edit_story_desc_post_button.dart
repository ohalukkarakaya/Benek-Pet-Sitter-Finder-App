import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';

class EditStoryDescPostButton extends StatefulWidget {
  final bool isDescReady;
  final void Function()? onTap;

  const EditStoryDescPostButton({
    super.key,
    this.isDescReady = false,
    this.onTap,
  });

  @override
  State<EditStoryDescPostButton> createState() => _EditStoryDescPostButtonState();
}

class _EditStoryDescPostButtonState extends State<EditStoryDescPostButton> {
  bool isHovered = false;
  @override
  Widget build(BuildContext context) {
    return MouseRegion(
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
      child: GestureDetector(
        onTap: widget.isDescReady ? widget.onTap : null,
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: !isHovered
                ? AppColors.benekBlack
                : widget.isDescReady
                    ? AppColors.benekLightBlue
                    : AppColors.benekRed,
            borderRadius: BorderRadius.circular(6.0),
          ),
          padding: const EdgeInsets.symmetric(vertical: 25.0),
          child: Center(
            child: Text(
              !widget.isDescReady
              && isHovered
                  ? BenekStringHelpers.locale('enterDescFirst')
                  : BenekStringHelpers.locale('post'),
              style: mediumTextStyle(
                textColor: !isHovered || !widget.isDescReady ? AppColors.benekWhite : AppColors.benekBlack,
                textFontSize: 16.0,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
