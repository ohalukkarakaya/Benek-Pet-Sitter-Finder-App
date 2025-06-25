import 'package:flutter/material.dart';
import '../../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../../common/widgets/approve_screen.dart';

class MapBackAndCancelButton extends StatefulWidget {
  final bool didEdit;
  final bool shouldTakeAprovvement;
  const MapBackAndCancelButton({
    super.key,
    required this.didEdit,
    this.shouldTakeAprovvement = true
  });

  @override
  State<MapBackAndCancelButton> createState() => _MapBackAndCancelButtonState();
}

class _MapBackAndCancelButtonState extends State<MapBackAndCancelButton> {
  bool didHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => didHovered = true),
      onExit: (_) => setState(() => didHovered = false),
      child: GestureDetector(
        onTap: () async {
          bool didApprove = widget.didEdit
            && widget.shouldTakeAprovvement
              ? await Navigator.push(
                  context,
                  PageRouteBuilder(
                    opaque: false,
                    barrierDismissible: false,
                    pageBuilder: (context, _, __) => ApproveScreen(
                      isNegative: true,
                      title: BenekStringHelpers.locale('approveCancelChanges'),
                    ),
                  ),
                )
              : true;

          if (didApprove) {
            Navigator.pop(context);
          }
        },
        child: Container(
          width: 48.0,
          height: 48.0,
          padding: const EdgeInsets.all(12.0),
          decoration: BoxDecoration(
            color: !didHovered
                ? AppColors.benekBlack.withOpacity(0.8)
                : AppColors.benekLightRed,
            borderRadius: BorderRadius.circular(6.0),
          ),
          child: Center(
            child: Icon(
              BenekIcons.left,
              color: !didHovered ? AppColors.benekWhite : AppColors.benekRed,
              size: 16.0,
            ),
          ),
        ),
      ),
    );
  }
}