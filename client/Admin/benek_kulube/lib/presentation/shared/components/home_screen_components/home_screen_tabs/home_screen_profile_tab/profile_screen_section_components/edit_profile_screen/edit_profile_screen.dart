import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/care_giver_badge.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/upload_profile_image_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../common/widgets/slide_to_act.dart';
import '../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../../../../../store/actions/app_actions.dart';
import '../../../../../loading_components/benek_blured_modal_barier.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../adress_row/adress_map.dart';
import '../profile_adress_widget.dart';
import '../text_with_character_limit_component/text_with_character_limit_controlled_component.dart';
import 'become_care_giver_button.dart';
import 'change_account_info_button.dart';
import 'deactivate_account_button.dart';
import 'edit_account_info_menu_item.dart';
import 'edited_bio_row.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final FocusNode _editProfileFocusNode = FocusNode();

  bool shouldPop = false;
  bool didApprove = false;
  bool isLoading = true;
  bool didChanged = false;

  @override
  void initState() {
    super.initState();
    _editProfileFocusNode.requestFocus();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = StoreProvider.of<AppState>(context);
      await store.dispatch(getUsersPrivateInfoRequestAction());
      setState(() {
        isLoading = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);

    UserInfo userInfo = store.state.userInfo!;

    if (shouldPop && store.state.processCounter == 0) {
      setState(() {
        shouldPop = false;
      });

      Navigator.of(context).pop();
    }

    return BenekBluredModalBarier(
      isDismissible: false,
      onDismiss: () {
        setState(() {
          shouldPop = true;
        });
      },
      child: KeyboardListener(
        focusNode: _editProfileFocusNode,
        onKeyEvent: (KeyEvent event) {
          if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
            setState(() {
              shouldPop = true;
            });
          }
        },
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 260.0),
            child: Center(
              child: ScrollConfiguration(
                behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Padding(
                    padding: const EdgeInsets.only(top: 150.0, bottom: 80),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                UploadProfileImageButton(
                                  userInfo: userInfo,
                                ),
                                const SizedBox(width: 20.0,),
                                Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    TextWithCharacterLimitControlledComponent(
                                      text: BenekStringHelpers.getUsersFullName(
                                          userInfo.identity!.firstName!,
                                          userInfo.identity!.lastName!,
                                          userInfo.identity!.middleName
                                      ),
                                      characterLimit: 20,
                                      fontSize: 15.0,
                                    ),
                                    const SizedBox(height: 2.0,),
                                    Text(
                                        "@${userInfo.userName}",
                                        style: regularTextWithoutColorStyle()
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            IgnorePointer(
                              ignoring: !didChanged,
                              child: SizedBox(
                                width: 275,
                                height: 65,
                                child: Builder(
                                  builder: (context) {
                                    return SlideAction(
                                      sliderButtonIconSize: 15,
                                      sliderButtonIconPadding: 15,
                                      text: BenekStringHelpers.locale('approveChanges'),
                                      borderRadius: 6.0,
                                      textStyle: regularTextStyle(
                                        textColor: didChanged ? AppColors.benekBlack : Colors.grey,
                                        textFontSize: 9.0,
                                      ),
                                      onSubmit: () async {
                                        setState(() {
                                          didApprove = true;
                                        });
                                        Navigator.of(context).pop(didApprove);
                                      },
                                      innerColor: didChanged ? AppColors.benekBlack : Colors.grey,
                                      outerColor: didChanged ? AppColors.benekLightBlue : Colors.grey[300]!,
                                      submittedIcon: const Icon(
                                        Icons.done,
                                        color: AppColors.benekBlack,
                                        size: 20,
                                      ),
                                      sliderButtonYOffset: 4,
                                    );
                                  },
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20.0,),
                        EditedBioRow(bio: userInfo.identity!.bio!),
                        const SizedBox(height: 20.0,),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            ProfileAdresMapWidget(
                              userLocation: userInfo.location!,
                            ),
                            ProfileAdressWidget(
                              isEdit: true,
                              openAdress: userInfo.identity?.openAdress,
                              isDark: true,
                              location: userInfo.location,
                              width: 450,
                              longButtonWidth: 350,
                            ),
                          ],
                        ),
                        const SizedBox(height: 20.0,),

                        userInfo.isCareGiver == null
                        || userInfo.isCareGiver != null
                           && !(userInfo.isCareGiver!)
                            ? const BecomeCareGiverButton()
                            : const SizedBox(),

                        const SizedBox(height: 20.0,),

                        Container(
                          padding: const EdgeInsets.all(25.0),
                          decoration: const BoxDecoration(
                            color: AppColors.benekBlack,
                            borderRadius: BorderRadius.all(Radius.circular(6.0)),
                          ),
                          child: isLoading
                              ? Column(
                                children: List.generate(6, (index) => Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 5.0),
                                  child: Shimmer.fromColors(
                                    baseColor: AppColors.benekWhite.withOpacity(0.4),
                                    highlightColor: AppColors.benekWhite.withOpacity(0.2),
                                    child: Container(
                                      height: 50.0,
                                      decoration: BoxDecoration(
                                        color: AppColors.benekBlack.withOpacity(0.4),
                                        borderRadius: BorderRadius.circular(6.0),
                                      ),
                                    ),
                                  ),
                                )
                                )
                            )
                           : Column(
                            children: [
                              EditAccountInfoMenuItem(
                                icon: Icons.perm_identity,
                                text: BenekStringHelpers.getUsersFullName(
                                    userInfo.identity!.firstName!,
                                    userInfo.identity!.lastName!,
                                    userInfo.identity!.middleName
                                ),
                              ),
                              const Divider(color: AppColors.benekGrey,),
                              EditAccountInfoMenuItem(
                                icon: FontAwesomeIcons.at,
                                text: userInfo.userName!
                              ),
                              const Divider(color: AppColors.benekGrey,),
                              EditAccountInfoMenuItem(
                                icon: Icons.email,
                                text: userInfo.email!,
                              ),
                              const Divider(color: AppColors.benekGrey,),
                              EditAccountInfoMenuItem(
                                icon: Icons.phone,
                                text: userInfo.phone!,
                              ),
                              const Divider(color: AppColors.benekGrey,),

                              userInfo.identity != null && userInfo.identity!.nationalIdentityNumber != null
                                  ? EditAccountInfoMenuItem(
                                    icon: Icons.verified_user,
                                    text: 'TC No: ${userInfo.identity!.nationalIdentityNumber}',
                                  )
                                  : const SizedBox(),

                              const Divider(color: AppColors.benekGrey,),

                              EditAccountInfoMenuItem(
                                icon: Icons.attach_money_rounded,
                                text: 'IBAN: ${userInfo.iban!}',
                              )
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

