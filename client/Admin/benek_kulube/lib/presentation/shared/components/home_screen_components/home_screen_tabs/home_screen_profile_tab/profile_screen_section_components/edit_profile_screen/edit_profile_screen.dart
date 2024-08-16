import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/care_giver_badge.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/single_line_edit_text.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/upload_profile_image_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../../../../../store/actions/app_actions.dart';
import '../../../../../loading_components/benek_blured_modal_barier.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import 'become_care_giver_button.dart';
import 'deactivate_account_button.dart';
import 'edit_account_info_menu_item.dart';
import 'edit_adress_widget.dart';
import 'edit_profile_profile_widget.dart';
import 'edit_text_screen.dart';
import 'edited_bio_row.dart';
import 'menu_items/edit_email_button.dart';
import 'menu_items/edit_full_name_button.dart';
import 'menu_items/edit_user_name_button.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final FocusNode _editProfileFocusNode = FocusNode();

  bool shouldPop = false;
  bool isLoading = true;

  bool idle = false;

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
                            EditProfileProfileWidget(
                              userInfo: userInfo,
                            ),

                            const DeactivateAccountButton(),
                          ],
                        ),
                        const SizedBox(height: 20.0,),

                        EditedBioRow(bio: userInfo.identity!.bio!),

                        const SizedBox(height: 20.0,),

                        EditAdressWidget(userInfo: userInfo),

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

                              EditFullNameButton(
                                userInfo: userInfo,
                                onDispatch: (text) => store.dispatch(updateFullNameRequestAction(text)),
                              ),

                              const Divider(color: AppColors.benekGrey,),

                              EditUserNameButton(
                                userInfo: userInfo,
                                onDispatch: (text) => store.dispatch(updateUserNameAction(text)),
                                updateParentWidgetFunction: () => setState(() { idle = !idle; }),
                              ),

                              const Divider(color: AppColors.benekGrey,),

                              EditEmailButton(
                                userInfo: userInfo,
                                onDispatch: (text) => store.dispatch(updateEmailRequestAction(text)),
                                onVerifyDispatch: (email, text) => store.dispatch(verifyEmailOtpRequestAction(email, text)),
                                onResendDispatch: (text) => store.dispatch(resendEmailOtpRequestAction(text)),
                              ),

                              const Divider(color: AppColors.benekGrey,),

                              EditAccountInfoMenuItem(
                                icon: Icons.phone,
                                desc: BenekStringHelpers.locale('phoneNumber'),
                                text: userInfo.phone!,
                              ),
                              const Divider(color: AppColors.benekGrey,),

                              userInfo.identity != null && userInfo.identity!.nationalIdentityNumber != null
                                  ? EditAccountInfoMenuItem(
                                    icon: Icons.verified_user,
                                    desc: BenekStringHelpers.locale('TCNo'),
                                    text: userInfo.identity!.nationalIdentityNumber!,
                                  )
                                  : const SizedBox(),

                              const Divider(color: AppColors.benekGrey,),

                              EditAccountInfoMenuItem(
                                icon: Icons.attach_money_rounded,
                                desc: BenekStringHelpers.locale('iban'),
                                text: userInfo.iban!,
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

