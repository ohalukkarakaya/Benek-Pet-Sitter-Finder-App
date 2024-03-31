import 'package:benek_kulube/presentation/features/user_profile_helpers/auth_role_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../data/models/user_profile_models/auth_role_model.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../benek_circle_avatar/benek_circle_avatar.dart';

class ProfileRowWidget extends StatelessWidget {
  final UserInfo selectedUserInfo;
  const ProfileRowWidget({
    super.key,
    required this.selectedUserInfo
  });

  @override
  Widget build(BuildContext context) {

    AuthRoleData authRoleData = AuthRoleHelper.getAuthRoleDataFromId( selectedUserInfo.authRole! );

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Hero(
              tag: 'user_avatar_${selectedUserInfo.userId}',
              child: BenekCircleAvatar(
                width: 70,
                height: 70,
                radius: 100,
                isDefaultAvatar: selectedUserInfo.profileImg!.isDefaultImg!,
                imageUrl: selectedUserInfo.profileImg!.imgUrl!,
              ),
            ),

            const SizedBox(width: 10.0,),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  BenekStringHelpers.getUsersFullName(
                      selectedUserInfo.identity!.firstName!,
                      selectedUserInfo.identity!.lastName!,
                      selectedUserInfo.identity!.middleName
                  ),
                  style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 15.0,
                      fontWeight: FontWeight.w500
                  ),
                ),

                const SizedBox(height: 2.0,),

                Text(
                  "@${selectedUserInfo.userName}",
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
          padding: const EdgeInsets.all(18.0),
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
