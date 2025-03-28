import 'package:benek_kulube/presentation/features/user_profile_helpers/punishment_helper.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';

import '../../../../../../../common/constants/app_colors.dart';

class PunishmentCountCardBig extends StatelessWidget {
  final int punishmentCount;

  const PunishmentCountCardBig({
    Key? key,
    required this.punishmentCount,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlack.withOpacity(0.7),
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(color: AppColors.benekGrey, width: 1.5),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 16.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                3,
                    (index) => Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12.0),
                  child: Icon(
                    Icons.block,
                    size: 40,
                    color: index + 1 <= punishmentCount
                        ? PunishmentHelper.getPunishmentColor(index + 1)
                        : AppColors.benekDarkGrey,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16.0),
          ],
        ),
      ),
    );
  }
}