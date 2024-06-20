import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';

class TextWithCharacterLimitAndToolTipWidget extends StatefulWidget {
  final String text;
  final int characterLimit;
  final double fontSize;
  const TextWithCharacterLimitAndToolTipWidget({
    super.key,
    required this.text,
    this.characterLimit = 14,
    this.fontSize = 15.0
  });

  @override
  State<TextWithCharacterLimitAndToolTipWidget> createState() => _TextWithCharacterLimitAndToolTipWidgetState();
}

class _TextWithCharacterLimitAndToolTipWidgetState extends State<TextWithCharacterLimitAndToolTipWidget> {
  bool isHovering = false;
  final ElTooltipController _textToolController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElTooltip(
        color: AppColors.benekLightBlue,
        showModal: false,
        position: ElTooltipPosition.topCenter,
        showChildAboveOverlay: false,
        content: Text(
            widget.text,
            style: const TextStyle(
                color: AppColors.benekBlack,
                fontSize: 12.0,
                fontWeight: FontWeight.w500,
                fontFamily: 'Qanelas'
            )
        ),
        controller: _textToolController,
        child: MouseRegion(
          onHover: (event) {
              if( _textToolController.value != ElTooltipStatus.showing ){
                setState(() {
                  _textToolController.show();
                });
              }
          },
          onExit: (event) {
            if( _textToolController.value == ElTooltipStatus.showing ){
              setState(() {
                _textToolController.hide();
              });
            }

          },
          child: Text(
            BenekStringHelpers.getStringWithCharacterLimit(
                widget.text,
                widget.characterLimit // Character Limit
            ),
            style: TextStyle(
                fontFamily: 'Qanelas',
                fontSize: widget.fontSize,
                fontWeight: FontWeight.w500
            ),
          ),
        ),

      ),
    );
  }
}
