import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/features/user_profile_helpers/auth_role_helper.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/punish_buton.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/text_with_character_limit_component/text_with_character_limit_controlled_component.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../data/models/user_profile_models/auth_role_model.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../benek_circle_avatar/benek_circle_avatar.dart';
import 'edit_profile_button.dart';
import 'edit_profile_screen/edit_profile_screen.dart';
import 'give_auth_role_button.dart';

class ProfileRowWidget extends StatelessWidget {
  final int authRoleId;
  final bool isUsersProfile;
  final UserInfo selectedUserInfo;
  const ProfileRowWidget({
    super.key,
    required this.authRoleId,
    required this.isUsersProfile,
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
              child: Stack(
                children: [
                  SizedBox(
                    width: isUsersProfile ? 75 : 70,
                    height: isUsersProfile ? 75 : 70,
                  ),
                  Positioned(
                    right: 0,
                    top: 0,
                    child: BenekCircleAvatar(
                      width: 70,
                      height: 70,
                      radius: 100,
                      isDefaultAvatar: selectedUserInfo.profileImg!.isDefaultImg!,
                      imageUrl: selectedUserInfo.profileImg!.imgUrl!,
                    ),
                  ),
                  isUsersProfile
                    ? Positioned(
                      left: 0.0,
                      bottom: 0.0,
                      child: EditProfileButton(
                        onTap: () {
                          Navigator.push(
                            context,
                            PageRouteBuilder(
                              opaque: false,
                              barrierDismissible: false,
                              pageBuilder: (context, _, __) => const EditProfileScreen(),
                            ),
                          );
                        },
                      ),
                    )
                    : const SizedBox()
                ],
              ),
            ),

            const SizedBox(width: 10.0,),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                TextWithCharacterLimitControlledComponent(
                  text: BenekStringHelpers.getUsersFullName(
                      selectedUserInfo.identity!.firstName!,
                      selectedUserInfo.identity!.lastName!,
                      selectedUserInfo.identity!.middleName
                  ),
                  characterLimit: 14,
                  fontSize: 15.0,
                ),

                const SizedBox(height: 2.0,),

                Text(
                  "@${selectedUserInfo.userName}",
                  style: regularTextWithoutColorStyle()
                ),
              ],
            ),
          ],
        ),

        Container(
          decoration: BoxDecoration(
            color: AppColors.benekBlack.withOpacity(0.2),
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          child: Row(
            children: [
              Padding(
                padding: EdgeInsets.only(
                    left: 17.0,
                    top: 17.0,
                    bottom: 17.0,
                    right: !(AuthRoleHelper.checkIfRequiredRole(
                      authRoleId,
                      [ AuthRoleHelper.getAuthRoleIdFromRoleName( 'superAdmin' ) ]
                    )) ? 17.0
                       : 0.0
                ),
                child: Text(
                  authRoleData.authRoleText,
                  style: blackTextStyle( textColor: authRoleData.authRoleColor),
                ),
              ),

              const SizedBox(width: 10.0,),

              AuthRoleHelper.checkIfRequiredRole( authRoleId, [ AuthRoleHelper.getAuthRoleIdFromRoleName( 'superAdmin' ) ] )
                  ? const GiveAuthRoleButton()
                  : const SizedBox(),
            ],
          ),
        ),

        PunishUserButton(
          isActive: AuthRoleHelper.checkIfRequiredRole(
            authRoleId,
            [
              AuthRoleHelper.getAuthRoleIdFromRoleName( 'superAdmin' ),
              AuthRoleHelper.getAuthRoleIdFromRoleName( 'moderator' )
            ]
          ),
        ),
      ],
    );
  }
}
