import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class ProfileAdressWidget extends StatelessWidget {
  final Store<AppState> store;
  const ProfileAdressWidget({
    super.key,
    required this.store
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: AppColors.benekBlack.withOpacity(0.2),
        borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
      ),
      child: Text(
        // "${store.state.selectedUserInfo!.location!.country} / ${store.state.selectedUserInfo!.location!.city}",
        "Turkey / Istanbul",
        style: const TextStyle(
            fontFamily: 'Qanelas',
            fontSize: 12.0,
            color: AppColors.benekWhite,
            fontWeight: FontWeight.w500
        ),
      ),
    );
  }
}
