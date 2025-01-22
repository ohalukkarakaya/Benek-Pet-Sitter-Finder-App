import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/presentation/features/user_profile_helpers/auth_role_helper.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../common/widgets/approve_screen.dart';
import '../../../../../../../../store/actions/app_actions.dart';
import '../../../../../../../../data/models/user_profile_models/user_info_model.dart';

import '../../../../../benek_circle_avatar/benek_circle_avatar.dart';
import '../../../../../loading_components/benek_blured_modal_barier.dart';
import '../benek_text_chip.dart';
import '../text_with_character_limit_component/text_with_character_limit_controlled_component.dart';

class EditUserAuthScreen extends StatefulWidget {
  const EditUserAuthScreen({Key? key}) : super(key: key);

  @override
  State<EditUserAuthScreen> createState() => _EditUserAuthScreenState();
}

class _EditUserAuthScreenState extends State<EditUserAuthScreen> {
  bool idle = false;

  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);
    final UserInfo userInfo = store.state.selectedUserInfo!;

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () => Navigator.of(context).pop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Padding(
            // Masaüstü ekranı varsayılarak yanlardan boşluk
            padding: const EdgeInsets.symmetric(horizontal: 200.0),
            child: Material(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.benekBlack.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Stack(
                  children: [
                    // İçerik
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Kullanıcı bilgileri
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Avatar
                            Hero(
                              tag: 'user_avatar_${userInfo.userId}',
                              child: BenekCircleAvatar(
                                width: 70,
                                height: 70,
                                radius: 100,
                                isDefaultAvatar: userInfo.profileImg?.isDefaultImg ?? true,
                                imageUrl: userInfo.profileImg?.imgUrl ?? '',
                              ),
                            ),
                            const SizedBox(width: 16.0),
                            // İsim ve kullanıcı adı
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  TextWithCharacterLimitControlledComponent(
                                    text: BenekStringHelpers.getUsersFullName(
                                      userInfo.identity?.firstName ?? '',
                                      userInfo.identity?.lastName ?? '',
                                      userInfo.identity?.middleName,
                                    ),
                                    characterLimit: 30,
                                    fontSize: 18.0,
                                  ),
                                  const SizedBox(height: 4.0),
                                  Text(
                                    "@${userInfo.userName}",
                                    style: regularTextWithoutColorStyle().copyWith(
                                      fontSize: 14,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        // Biraz ayrım
                        const SizedBox(height: 16.0),

                        // İletişim Bilgileri (Eposta & Telefon)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            BenekTextChip(
                              enableHoverEffect: false,
                              shouldCopyOnTap: false,
                              text: userInfo.email ?? " - ",
                              opacity: 1,
                              isLight: true,
                            ),
                            const SizedBox(width: 8.0),
                            BenekTextChip(
                              enableHoverEffect: false,
                              shouldCopyOnTap: false,
                              text: userInfo.phone ?? " - ",
                              opacity: 1,
                              isLight: true,
                            ),
                          ],
                        ),

                        // Divider ile ayırmak
                        const SizedBox(height: 20.0),
                        const Divider(thickness: 0.5, color: AppColors.benekWhite),
                        const SizedBox(height: 10.0),

                        const SizedBox(height: 8.0),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: List.generate(5, (index) {
                            return SizedBox(
                              height: 50,
                              width: 145,
                              child: BenekTextChip(
                                onTap: () async {
                                  if( !(AuthRoleHelper.checkIfRequiredRole(userInfo.authRole!, [index])) ){

                                    bool? isApproved = await Navigator.push(
                                      context,
                                      PageRouteBuilder(
                                        opaque: false,
                                        barrierDismissible: false,
                                        pageBuilder: (context, _, __) => ApproveScreen(
                                          title: BenekStringHelpers.locale('slideToApprove'),
                                        ),
                                      ),
                                    );

                                    if( !isApproved! ) return;

                                    await store.dispatch(setUserAuthRoleRequestAction(userInfo.userId!, index.toString()));
                                    setState(() {
                                      idle = !idle;
                                    });

                                    Navigator.of(context).pop();
                                  }
                                },
                                enableHoverEffect: true,
                                shouldCopyOnTap: false,
                                text: AuthRoleHelper.getAuthRoleDataFromId(index).authRoleText,
                                opacity: 1,
                                isActive: AuthRoleHelper.checkIfRequiredRole(userInfo.authRole!, [index]),
                                textColor: AuthRoleHelper.getAuthRoleDataFromId(index).authRoleColor,
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}