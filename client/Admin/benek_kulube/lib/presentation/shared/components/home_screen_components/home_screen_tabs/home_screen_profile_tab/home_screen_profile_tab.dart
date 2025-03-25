import 'dart:developer';
import 'dart:io';
import 'dart:ui';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/care_give_career_preview_widget/care_give_preview_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/past_care_givers_preview_widget/past_care_givers_preview_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/adress_row/adress_map.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/care_giver_badge.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/pet_profile_screen_components/pet_images_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_contact_row.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/create_story_screen.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/kulube_stories_board.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_adress_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_bio_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_row.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/story_watch_screen.dart';
import 'package:benek_kulube/presentation/shared/screens/pet_search_screen.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import '../../../../../../common/utils/benek_toast_helper.dart';
import '../../../../../../common/widgets/benek_message_box_widget/benek_message_box_widget.dart';
import '../../../../../../data/models/story_models/story_model.dart';
import '../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../benek_pet_avatars_horizontal_list/benek_pet_stack_widget.dart';
import 'benek_profile_stars_widget/benek_profile_star_widget.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  bool didRequestSend = false;
  Size storyBoardSize = const Size(540, 250);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = StoreProvider.of<AppState>(context);

      if( !didRequestSend ){
        await store.dispatch(IncreaseProcessCounterAction());
        didRequestSend = true;

        await store.dispatch(getUserInfoByUserIdAction( store.state.selectedUserInfo?.userId ));

        // get stories
        if( store.state.selectedPet != null ){
          await store.dispatch(getStoriesByPetIdRequestAction( store.state.selectedPet?.id ));
          await store.dispatch(getPetPhotosByIdRequestAction( store.state.selectedPet?.id ));
        } else {
          await store.dispatch(getStoriesByUserIdRequestAction( store.state.selectedUserInfo?.userId ));
          await store.dispatch(getSelectedUserStarDataAction( store.state.selectedUserInfo?.userId ));
          await store.dispatch(getPetsByUserIdRequestAction( store.state.selectedUserInfo?.userId ));
          await store.dispatch(initPastCareGiversAction());
          await store.dispatch(initCareGiveDataAction());
        }
      }

      if( store.state.userInfo?.userId != store.state.selectedUserInfo?.userId || store.state.selectedPet != null){
        updateStoryBoardSize();
      }

      await store.dispatch(DecreaseProcessCounterAction());
    });
  }

  void updateStoryBoardSize() {
    setState(() {
      storyBoardSize = calculateStoryBoardSize();
    });
  }

  Size calculateStoryBoardSize() {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    return Size(
      540,
      store.state.storiesToDisplay != null && store.state.storiesToDisplay!.isEmpty ? 150 : 250,
    );
  }


  Future<void> createStoryPageBuilderFunction() async {
    // choose file
    final String? directoryPath = await ImageVideoHelpers.pickFile(['jpg', 'jpeg', 'mp4', 'mov', 'avi']);
    if( directoryPath == null ){
      return;
    }

    final File file = File(directoryPath);

    if (! await file.exists()) {
      // Dosya yok
      BenekToastHelper.showErrorToast(
          BenekStringHelpers.locale('invalidPath'),
          BenekStringHelpers.locale('invalidPathDesc'),
          context
      );

      return;
    }

    // choose pet
    final pickedPet = await Navigator.push(
      context,
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: false,
        pageBuilder: (context, _, __) => const KulubePetSearchScreen(),
      ),
    );

    if( pickedPet == null ){
      return;
    }

    //open story create page
    Navigator.push(
      context,
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: false,
        pageBuilder: (context, _, __) => CreateStoryScreen(
          src: directoryPath,
          pet: pickedPet,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, Map<String, Object?>?>(
        converter: (Store<AppState> store) => { "selectedUser": store.state.selectedUserInfo, "selectedPet": store.state.selectedPet },
        builder: (BuildContext context, Map<String, Object?>? selectedDataInfo) {
          UserInfo? selectedUserInfo = selectedDataInfo?["selectedUser"] as UserInfo?;
          PetModel? selectedPetInfo = selectedDataInfo?["selectedPet"] as PetModel?;

          bool isCareGiver = selectedUserInfo!.isCareGiver != null && selectedUserInfo.isCareGiver!;

          Store<AppState> store = StoreProvider.of<AppState>(context);
          return Container(
            padding: const EdgeInsets.only(left: 60.0, bottom: 20.0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    BenekMessageBoxWidget(
                      size: storyBoardSize,
                      child: KulubeStoriesBoard(
                        isUsersProfile: selectedPetInfo == null && store.state.userInfo?.userId == selectedUserInfo.userId,
                        onTapPageBuilder: (dynamic Function() selectStoryFunction, List<StoryModel>? stories, int index) async {
                          bool isUsersProfile = selectedPetInfo == null && store.state.userInfo?.userId == selectedUserInfo.userId;
                          int indx = isUsersProfile && stories != null ? index - 1 : index;

                          if( stories?[indx] != null ){
                            await selectStoryFunction();
                          }

                          String storyId = await Navigator.push(
                            context,
                            PageRouteBuilder(
                              opaque: false,
                              barrierDismissible: false,
                              pageBuilder: (context, _, __) => const StoryWatchScreen(),
                            ),
                          );

                          if (storyId != null && storyId.isNotEmpty) {
                            await Future.delayed(const Duration(milliseconds: 200));
                            await store.dispatch(resetStoryCommentsAction(storyId));
                          }
                        },
                        createStoryPageBuilderFunction: createStoryPageBuilderFunction,
                      ),
                    ),
                  ],
                ),

                ProfileRowWidget(
                    authRoleId: store.state.userRoleId,
                    isUsersProfile: store.state.userInfo!.userId == selectedUserInfo.userId,
                    selectedUserInfo: selectedUserInfo,
                    selectedPet: selectedPetInfo
                ),

                ProfileContactRowWidget(
                  userId: selectedPetInfo == null ? selectedUserInfo.userId : selectedPetInfo.id,
                  email: selectedPetInfo == null
                            ? selectedUserInfo.email
                            : BenekStringHelpers.isLanguageTr()
                                ? selectedPetInfo.kind?.tr
                                : selectedPetInfo.kind?.en,
                  phoneNumber: selectedPetInfo == null
                                  ? selectedUserInfo.phone
                                  : "${BenekStringHelpers.getAgeAsInt( selectedPetInfo!.birthDay! )} ${BenekStringHelpers.locale('yearsOld')}",
                ),

                (
                    selectedUserInfo != null
                && selectedUserInfo.identity != null
                && selectedUserInfo.identity!.bio != null
                )
                || (
                    selectedPetInfo != null
                    && selectedPetInfo.bio != null
                   )
                    ? Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        ProfileBioWidget( text: '" ${selectedPetInfo == null ? selectedUserInfo.identity!.bio! : selectedPetInfo.bio} "' ),
                      ],
                    )
                    : const SizedBox(),

                selectedPetInfo != null && selectedPetInfo.images != null && selectedPetInfo.images!.isNotEmpty
                  ? PetImagesWidget(
                      images: selectedPetInfo.images,
                    )
                  : const SizedBox(),

                Padding(
                  padding: const EdgeInsets.only(top: 20.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [

                      selectedPetInfo == null
                          ? CareGiverBadge(isCareGiver: isCareGiver)
                          : const SizedBox(),

                      selectedPetInfo == null ?
                        BenekProfileStarWidget(
                          star: selectedUserInfo.starAverage ?? 0,
                          starCount: selectedUserInfo.totalStar ?? 0,
                          starList: selectedUserInfo.stars,
                        )
                        : const SizedBox(),

                      selectedPetInfo == null
                        ? BenekPetStackWidget(
                          isPetList: selectedPetInfo == null,
                          petList: selectedPetInfo == null ? selectedUserInfo.pets : selectedPetInfo.allOwners,
                        )
                        : const SizedBox(),
                    ],
                  ),
                ),

                selectedPetInfo == null
                 ? Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        PastCareGiverPreviewWidget(
                          title: BenekStringHelpers.locale('pastCareGiversTitle'),
                          pastCareGiversEmptyStateTitle: BenekStringHelpers.locale('pastCareGiversEmptyMessage'),
                          pastCareGiveList: selectedUserInfo.pastCaregivers,
                        ),

                        CareGivePreviewWidget(
                          title: BenekStringHelpers.locale('givenCareGivesTitle'),
                          emptyStateTitle: BenekStringHelpers.locale('givenCareGivesEmptyMessage'),
                          careGiveList: selectedUserInfo.caregiverCareer,
                        ),
                      ],
                    ),
                  )
                : const SizedBox(),

                selectedUserInfo.location != null
                    ? Padding(
                      padding: const EdgeInsets.only(top: 20.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ProfileAdresMapWidget(
                            userLocation: selectedUserInfo.location!,
                          ),

                          ProfileAdressWidget(
                            openAdress: selectedUserInfo.identity?.openAdress,
                            location: selectedUserInfo.location,
                          ),
                        ],
                      ),
                    )
                    : const SizedBox(),

                const SizedBox(height: 15.0),
              ],
            ),
          );
        }
    );
  }
}