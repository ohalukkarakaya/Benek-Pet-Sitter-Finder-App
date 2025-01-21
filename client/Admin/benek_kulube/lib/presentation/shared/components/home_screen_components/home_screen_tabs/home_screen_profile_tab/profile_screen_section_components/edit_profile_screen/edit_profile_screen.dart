import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/care_giver_badge.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/password_input_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/single_line_edit_text.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/upload_profile_image_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/widgets/reset_password_info_page.dart';
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
import 'menu_items/edit_paymen_info_button.dart';
import 'menu_items/edit_tc_no_button.dart';
import 'menu_items/edit_user_name_button.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  bool isLoading = true;

  bool idle = false;

  @override
  void initState() {
    super.initState();
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

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () {
        Navigator.of(context).pop();
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
                      EditProfileProfileWidget(
                        userInfo: userInfo,
                      ),
                      const SizedBox(height: 20.0,),

                      EditedBioRow(bio: userInfo.identity!.bio!),

                      const SizedBox(height: 20.0,),

                      EditAdressWidget(userInfo: userInfo),

                      const SizedBox(height: 20.0,),

                      userInfo.isCareGiver == null
                      || userInfo.isCareGiver != null
                         && !(userInfo.isCareGiver!)
                          ? BecomeCareGiverButton(
                              userInfo: userInfo,
                              onDispatch: () async {
                                await store.dispatch(becomeCareGiverAction(context));
                                setState(() {
                                  idle = !idle;
                                });
                              },
                            )
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
                              text: userInfo.phone != null && userInfo.phone!.isNotEmpty
                                ? userInfo.phone!
                                : BenekStringHelpers.locale('enterPhoneNumber'),
                            ),

                            const Divider(color: AppColors.benekGrey,),

                            EditTcNoButton(
                              userInfo: userInfo,
                              onDispatch: (text) => store.dispatch(updateTcIdNoAction(text)),
                            ),

                            const Divider(color: AppColors.benekGrey,),

                            EditPaymenInfoButton(
                              userInfo: userInfo,
                              onDispatch: (text) => store.dispatch(updatePaymentInfoAction(text)),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20.0,),

                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              Container(
                                decoration: const BoxDecoration(
                                  color: AppColors.benekBlack,
                                  borderRadius: BorderRadius.all(Radius.circular(6.0)),
                                ),
                                padding: const EdgeInsets.symmetric( horizontal: 21.2, vertical: 25.0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    const FaIcon(
                                        FontAwesomeIcons.lock,
                                        color: AppColors.benekWhite,
                                        size: 20.0
                                    ),
                                    const SizedBox(width: 10.0,),
                                    Text(
                                      BenekStringHelpers.locale('changePassword'),
                                      style: semiBoldTextStyle(
                                        textColor: AppColors.benekWhite,
                                        textFontSize: 14.0,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(width: 10.0,),

                              PasswordInputWidget(
                                onDispatch: (oldPassword, newPassword) => store.dispatch(updatePasswordRequestAction(newPassword, oldPassword, oldPassword)),
                              )
                            ],
                          ),

                          const SizedBox(height: 20.0,),

                          MouseRegion(
                            cursor: SystemMouseCursors.click,
                            child: GestureDetector(
                              onTap: () async {
                                await Navigator.push(
                                  context,
                                  PageRouteBuilder(
                                    opaque: false,
                                    barrierDismissible: false,
                                    pageBuilder: (context, _, __) => ResetPasswordInfoPage(
                                      onDispatch: () => store.dispatch(forgetMyPasswordRequestAction(userInfo.email!)),
                                    ),
                                  )
                                );
                              },
                              child: Padding(
                                padding: const EdgeInsets.only(left: 21.2),
                                child: Text(
                                  BenekStringHelpers.locale('forgetPassword'),
                                  style: regularTextStyle(
                                    textColor: AppColors.benekWhite,
                                    textFontSize: 14.0,
                                  ),
                                ),
                              ),
                            ),
                          )
                        ],
                      )
                    ],
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

