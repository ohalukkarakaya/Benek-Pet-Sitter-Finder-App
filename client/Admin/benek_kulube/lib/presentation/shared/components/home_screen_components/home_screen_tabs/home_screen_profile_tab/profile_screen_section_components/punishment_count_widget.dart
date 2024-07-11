import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../features/user_profile_helpers/punishment_helper.dart';

class PunishmentCountWidget extends StatelessWidget {
  final int punishmentCount;

  const PunishmentCountWidget({
    super.key,
    required this.punishmentCount
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
          top: 20.0,
          right: 40.0
      ),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all( 17.0 ),
        decoration: BoxDecoration(
          color: AppColors.benekBlack.withOpacity(0.2),
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: Center(
          child: Text(
            "${punishmentCount.toString()}  ${BenekStringHelpers.locale('punishment')}",
            style: TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 12.0,
              fontWeight: FontWeight.w400,
              color: PunishmentHelper.getPunishmentColor( punishmentCount )
            ),
          ),
        ),
      ),
    );
  }
}
