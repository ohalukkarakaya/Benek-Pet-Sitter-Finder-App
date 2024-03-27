import 'package:benek_kulube/presentation/features/user_profile_helpers/auth_role_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../data/models/user_profile_models/auth_role_model.dart';
import '../../../../benek_circle_avatar/benek_circle_avatar.dart';
import '../benek_profile_stars_widget/benek_profile_star_widget.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class ProfileRowWidget extends StatelessWidget {
  final Store<AppState> store;
  const ProfileRowWidget({
    super.key,
    required this.store
  });

  @override
  Widget build(BuildContext context) {

    AuthRoleData authRoleData = AuthRoleHelper.getAuthRoleDataFromId( store.state.selectedUserInfo!.authRole! );

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Hero(
              tag: 'user_avatar_${store.state.selectedUserInfo!.userId}',
              child: BenekCircleAvatar(
                width: 70,
                height: 70,
                radius: 100,
                isDefaultAvatar: store.state.selectedUserInfo!.profileImg!.isDefaultImg!,
                imageUrl: store.state.selectedUserInfo!.profileImg!.imgUrl!,
              ),
            ),

            const SizedBox(width: 10.0,),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  BenekStringHelpers.getUsersFullName(
                      store.state.selectedUserInfo!.identity!.firstName!,
                      store.state.selectedUserInfo!.identity!.lastName!,
                      store.state.selectedUserInfo!.identity!.middleName
                  ),
                  style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 15.0,
                      fontWeight: FontWeight.w500
                  ),
                ),

                const SizedBox(height: 2.0,),

                Text(
                  "@${store.state.selectedUserInfo!.userName}",
                  style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 12.0,
                      fontWeight: FontWeight.w400
                  ),
                ),
              ],
            ),
          ],
        ),

        Container(
          padding: const EdgeInsets.all(15.0),
          decoration: BoxDecoration(
            color: AppColors.benekBlack.withOpacity(0.2),
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Text(
            authRoleData.authRoleText,
            style: TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 12.0,
              color: authRoleData.authRoleColor,
              fontWeight: FontWeight.w900,
            ),
          ),
        ),

        Container(
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            color: AppColors.benekBlack.withOpacity(0.2),
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          width: 150,
          height: 50,
        ),
      ],
    );
  }
}
