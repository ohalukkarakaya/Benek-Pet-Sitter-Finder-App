import 'package:benek/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/upload_profile_image_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';


import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../text_with_character_limit_component/text_with_character_limit_controlled_component.dart';
import 'edit_profile_image/edit_profile_image_screen.dart';

class EditProfileProfileWidget extends StatefulWidget {
  final UserInfo userInfo;

  const EditProfileProfileWidget({
    super.key,
    required this.userInfo,
  });

  @override
  State<EditProfileProfileWidget> createState() => _EditProfileProfileWidgetState();
}

class _EditProfileProfileWidgetState extends State<EditProfileProfileWidget> {
  bool idle = false;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        UploadProfileImageButton(
          userInfo: widget.userInfo,
          onTap: () async {
            UserProfileImg? newImage = await Navigator.push(
              context,
              PageRouteBuilder(
                opaque: false,
                barrierDismissible: false,
                pageBuilder: (context, _, __) => const EditProfileImageScreen(),
              ),
            );

            if (newImage != null) {
              widget.userInfo.profileImg = newImage;
              setState(() { idle = !idle; });
            }
          },
        ),
        const SizedBox(width: 20.0,),
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            TextWithCharacterLimitControlledComponent(
              text: BenekStringHelpers.getUsersFullName(
                  widget.userInfo.identity!.firstName!,
                  widget.userInfo.identity!.lastName!,
                  widget.userInfo.identity!.middleName
              ),
              characterLimit: 20,
              fontSize: 15.0,
            ),
            const SizedBox(height: 2.0,),
            Text(
                "@${widget.userInfo.userName}",
                style: regularTextWithoutColorStyle()
            ),
          ],
        ),
      ],
    );
  }
}
