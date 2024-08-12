import 'dart:ui';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/upload_profile_image_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../../benek_circle_avatar/benek_circle_avatar.dart';
import '../../../../../loading_components/benek_blured_modal_barier.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../text_with_character_limit_component/text_with_character_limit_controlled_component.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final FocusNode _editProfileFocusNode = FocusNode();

  bool shouldPop = false;

  @override
  void initState() {
    super.initState();
    _editProfileFocusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);

    UserInfo userInfo = store.state.userInfo!;

    if( shouldPop && store.state.processCounter == 0  ){
      setState(() {
        shouldPop = false;
      });

      Navigator.of(context).pop();
    }

    return BenekBluredModalBarier(
      isDismissible: false,
      onDismiss: (){
        setState(() {
          shouldPop = true;
        });
      },
      child: KeyboardListener(
        focusNode: _editProfileFocusNode,
        onKeyEvent: (KeyEvent event){
          if(
            event is KeyDownEvent
            && event.logicalKey == LogicalKeyboardKey.escape
          ){
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
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  UploadProfileImageButton(
                    userInfo: userInfo,
                  ),

                  const SizedBox(
                    width: 20.0,
                  ),

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
                        characterLimit: 14,
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
            ),
          ),
        ),
      ),
    );
  }
}
