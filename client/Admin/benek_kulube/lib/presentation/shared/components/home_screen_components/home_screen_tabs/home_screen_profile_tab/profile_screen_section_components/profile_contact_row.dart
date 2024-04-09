import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';
import 'benek_text_chip.dart';

class ProfileContactRowWidget extends StatelessWidget {
  final String? userId;
  final String? email;
  final String? phoneNumber;
  const ProfileContactRowWidget({
    super.key,
    this.userId,
    this.email,
    this.phoneNumber,
  });

  @override
  Widget build(BuildContext context) {

    return Padding(
      padding: const EdgeInsets.only(top: 20.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [

          BenekTextChip(
            enableHoverEffect: true,
            shouldCopyOnTap: true,
            text: userId!,
          ),

          BenekTextChip(
            enableHoverEffect: true,
            shouldCopyOnTap: true,
            text: email,
          ),

          BenekTextChip(
            enableHoverEffect: true,
            shouldCopyOnTap: true,
            text: phoneNumber != null ? BenekStringHelpers.formatPhoneNumber(phoneNumber!) : null,
          ),
        ],
      ),
    );
  }
}
