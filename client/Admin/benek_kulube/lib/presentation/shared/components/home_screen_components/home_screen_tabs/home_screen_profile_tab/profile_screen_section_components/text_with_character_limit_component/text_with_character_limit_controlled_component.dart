import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/text_with_character_limit_component/text_with_character_limit_and_tool_tip_widget.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../common/utils/benek_string_helpers.dart';

class TextWithCharacterLimitControlledComponent extends StatelessWidget {
  final String text;
  final int characterLimit;
  final double fontSize;

  const TextWithCharacterLimitControlledComponent({
    super.key,
    required this.text,
    this.characterLimit = 14,
    this.fontSize = 15.0
  });

  @override
  Widget build(BuildContext context) {
    if( text.length > characterLimit ){
      return TextWithCharacterLimitAndToolTipWidget(
          text: text,
          characterLimit: characterLimit,
          fontSize: fontSize,
      );
    }else {
      return Text(
        BenekStringHelpers.getStringWithCharacterLimit(
            text,
            characterLimit // Character Limit
        ),
        style: TextStyle(
            fontFamily: 'Qanelas',
            fontSize: fontSize,
            fontWeight: FontWeight.w500
        ),
      );
    }
  }
}
