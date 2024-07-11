import 'dart:ui';

import '../../../common/constants/app_colors.dart';

class PunishmentHelper {
  static const Color lowDanger = AppColors.benekWhite;
  static const Color nearToDanger = AppColors.benekWarningOrange;
  static const Color danger = AppColors.benekRed;

  static Color? getPunishmentColor(int punishmentCount) {
    if (punishmentCount < 2) {
      return null;
    } else if (punishmentCount < 3) {
      return nearToDanger;
    } else {
      return danger;
    }
  }
}