import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class ProfileBioWidget extends StatelessWidget {
  final Store<AppState> store;
  const ProfileBioWidget({
    super.key,
    required this.store
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only( top: 20.0),
      child: Container(
        padding: const EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlack.withOpacity(0.2),
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: Wrap(
          children: [
            Text(
              '" ${store.state.selectedUserInfo!.identity!.bio!} "',
              style: const TextStyle(
                fontFamily: 'Qanelas',
                fontSize: 12.0,
                color: AppColors.benekWhite
              ),
            )
          ]
        ),
      ),
    );
  }
}
