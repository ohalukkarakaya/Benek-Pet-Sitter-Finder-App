import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/profile_card_addition_button.dart';
import 'package:flutter/material.dart';


class GiveAuthRoleButton extends StatelessWidget {
  const GiveAuthRoleButton({super.key});

  @override
  Widget build(BuildContext context) {
    return ProfileCardAdditionButton(
      hoveringText: BenekStringHelpers.locale('giveAuthRoleButonText'),
      iconData: Icons.key_outlined,
      angle: 90 * 3.14 / 180,
    );
  }
}