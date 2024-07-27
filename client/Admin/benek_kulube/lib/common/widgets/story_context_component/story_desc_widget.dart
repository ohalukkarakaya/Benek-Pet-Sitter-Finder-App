import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/story_context_component/tagged_pet_button_widget.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:flutter/widgets.dart';

import '../../../data/models/story_models/story_about_data_model.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';

import '../../constants/app_colors.dart';
import '../text_with_profile_img.dart';

class StoryDescWidget extends StatelessWidget {

  final UserProfileImg? profileImg;
  final String? desc;
  final StoryAboutDataModel? about;
  final String? createdAt;

  const StoryDescWidget({
    super.key,
    this.profileImg,
    this.desc,
    this.about,
    this.createdAt
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
      decoration: const BoxDecoration(
        color: AppColors.benekBlack,
        borderRadius: BorderRadius.all( Radius.circular( 6.0 ) ),
      ),
      child: profileImg != null && desc != null && about != null && createdAt != null
        ? Column(
          children: [
            TextWithProfileImg(
              text: desc!,
              profileImg: profileImg!
            ),

            const SizedBox(height: 20.0),

            TaggedPetButtonWidget(
              pet: about!.pet!
            ),

            const SizedBox(height: 20.0),

            Row(
              children: [
                Text(
                  createdAt!,
                  style: const TextStyle(
                    color: AppColors.benekWhite,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w300,
                    fontFamily: 'Qanelas',
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ],
        )
        : const SizedBox(),
    );
  }
}
