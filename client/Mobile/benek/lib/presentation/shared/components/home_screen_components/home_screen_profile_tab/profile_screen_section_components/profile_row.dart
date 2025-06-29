import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek/presentation/shared/components/benek_pet_avatars_horizontal_list/benek_pet_stack_widget.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/care_giver_badge.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/primary_owner_button.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/text_with_character_limit_component/text_with_character_limit_controlled_component.dart';
import 'package:flutter/material.dart';


import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import 'edit_profile_button.dart';
import 'edit_profile_screen/edit_profile_screen.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek/store/app_state.dart';
import 'package:benek/store/actions/app_actions.dart';

class ProfileRowWidget extends StatelessWidget {
  final int authRoleId;
  final bool isUsersProfile;
  final UserInfo selectedUserInfo;
  final PetModel? selectedPet;
  final bool isCareGiver;

  const ProfileRowWidget({
    super.key,
    required this.authRoleId,
    required this.isUsersProfile,
    required this.selectedUserInfo,
    this.selectedPet,
    this.isCareGiver = true
  });

  @override
  Widget build(BuildContext context) {

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Hero(
              tag: 'user_avatar_${ selectedPet == null ? selectedUserInfo.userId : selectedPet!.id }',
              child: Stack(
                children: [
                  SizedBox(
                    width: isUsersProfile && selectedPet == null ? 75 : 70,
                    height: isUsersProfile && selectedPet == null ? 75 : 70,
                  ),
                  Positioned(
                    right: 0,
                    top: 0,
                    child: BenekCircleAvatar(
                      width: 70,
                      height: 70,
                      radius: 100,
                      isDefaultAvatar: selectedPet == null ? selectedUserInfo.profileImg?.isDefaultImg ?? true : selectedPet!.petProfileImg!.isDefaultImg!,
                      imageUrl: selectedPet == null ?  selectedUserInfo.profileImg!.imgUrl! : selectedPet!.petProfileImg!.imgUrl!,
                    ),
                  ),
                  isUsersProfile
                  && selectedPet == null
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
                  text: selectedPet == null
                    ? BenekStringHelpers.getUsersFullName(
                      selectedUserInfo.identity!.firstName!,
                      selectedUserInfo.identity!.lastName!,
                      selectedUserInfo.identity!.middleName
                    )
                    : selectedPet!.name!,
                  characterLimit: 14,
                  fontSize: 15.0,
                ),

                const SizedBox(height: 2.0,),

                Text(
                  selectedPet == null ? "@${selectedUserInfo.userName}" : BenekStringHelpers.getPetGenderAsString( selectedPet!.sex! ),
                  style: regularTextWithoutColorStyle()
                ),
              ],
            ),
          ],
        ),

        selectedPet != null
          ? Row(
            children: [
              GestureDetector(
                onTap: () async{
                  Store<AppState> store = StoreProvider.of<AppState>(context);
                  await store.dispatch( setSelectedPetAction( null ) );
                  await store.dispatch( setStoriesAction( null ) );

                  UserInfo owner = selectedPet!.primaryOwner!;
                  await store.dispatch( setSelectedUserAction( null ) );
                  await Future.delayed(const Duration(milliseconds: 50));
                  await store.dispatch( setSelectedUserAction( owner ) );
                },
                child: PrimaryOwnerButton(
                  primaryOwner: selectedPet!.primaryOwner!,
                ),
              ),
              const SizedBox(width: 2.0,),
              BenekPetStackWidget(
                isPetList: selectedPet == null,
                petList: selectedPet == null ? selectedUserInfo.pets : selectedPet?.allOwners,
              ),
            ],
          )
          : CareGiverBadge(isCareGiver: isCareGiver),
      ],
    );
  }
}
