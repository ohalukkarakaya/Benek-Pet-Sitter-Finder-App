import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/text_with_character_limit_component/text_with_character_limit_controlled_component.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';

class PrimaryOwnerButton extends StatefulWidget {
  final UserInfo primaryOwner;
  const PrimaryOwnerButton({
    super.key,
    required this.primaryOwner,
  });

  @override
  State<PrimaryOwnerButton> createState() => _PrimaryOwnerButtonState();
}

class _PrimaryOwnerButtonState extends State<PrimaryOwnerButton> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onHover: (event) {
        setState(() {
          isHovering = true;
        });
      },
      onExit: (event) {
        setState(() {
          isHovering = false;
        });
      },
      child: Container(
        width: 150,
        height: 50,
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        decoration: BoxDecoration(
          color: !isHovering ? AppColors.benekBlackWithOpacity : AppColors.benekLightBlue,
          borderRadius: BorderRadius.circular(6.0),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            BenekCircleAvatar(
              isDefaultAvatar: widget.primaryOwner.profileImg!.isDefaultImg!,
              imageUrl: widget.primaryOwner.profileImg!.imgUrl!,
              width: 30,
              height: 30,
              borderWidth: 1.0,
              bgColor: !isHovering ? AppColors.benekWhite : AppColors.benekBlack,
            ),

            const SizedBox(width: 10.0,),

            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                TextWithCharacterLimitControlledComponent(
                  text: BenekStringHelpers.getUsersFullName(
                      widget.primaryOwner.identity!.firstName!,
                      widget.primaryOwner.identity!.lastName!,
                      widget.primaryOwner.identity!.middleName
                  ),
                  characterLimit: 10,
                  fontSize: 10.0,
                  textColor: !isHovering ? AppColors.benekWhite : AppColors.benekBlack,
                ),

                const SizedBox(height: 2.0,),

                Text(
                    BenekStringHelpers.locale('primaryOwner'),
                    style: regularTextWithoutColorStyle(
                      textFontSize: 8.0,
                      textColor: !isHovering ? AppColors.benekWhite : AppColors.benekBlack
                    )
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
