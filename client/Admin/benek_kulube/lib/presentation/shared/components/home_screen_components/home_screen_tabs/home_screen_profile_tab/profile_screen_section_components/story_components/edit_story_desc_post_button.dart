import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';

class EditStoryDescPostButton extends StatefulWidget {
  final void Function()? onTap;

  const EditStoryDescPostButton({
    super.key,
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
        onTap: widget.onTap,
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: !isHovered ? AppColors.benekBlack : AppColors.benekLightBlue,
            borderRadius: BorderRadius.circular(6.0),
          ),
          padding: const EdgeInsets.symmetric(vertical: 25.0),
          child: Center(
            child: Text(
              BenekStringHelpers.locale('post'),
              style: TextStyle(
                color: !isHovered ? AppColors.benekWhite : AppColors.benekBlack,
                fontSize: 16.0,
                fontWeight: FontWeight.w500,
                fontFamily: 'Qanelas',
              ),
            ),
          ),
        ),
      ),
    );
  }
}
