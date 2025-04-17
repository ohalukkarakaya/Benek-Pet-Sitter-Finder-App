import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/report_context_components/time_code_widget.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:flutter/material.dart';

import '../../../data/models/user_profile_models/user_info_model.dart';
import '../../constants/app_colors.dart';
import '../../utils/styles.text.dart';
import '../text_with_profile_img.dart';

class MissionDescWidget extends StatelessWidget {
  final String missionDesc;
  final UserInfo petOwner;
  final PetModel pet;
  final DateTime missionDeadline;
  final String timeCode;

  const MissionDescWidget({
    super.key,
    required this.missionDesc,
    required this.petOwner,
    required this.pet,
    required this.missionDeadline,
    required this.timeCode,
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
      child: Column(
        children: [
          TextWithProfileImg(
              text: missionDesc,
              profileImg: petOwner.profileImg!
          ),

          const SizedBox(height: 20.0),

          TimeCodeWidget(
              code: timeCode,
              textStyle: mediumTextStyle(
                textColor: AppColors.benekBlack,
                textFontSize: 15.0,
              ),
          ),

          const SizedBox(height: 20.0),

          Row(
            children: [
              Text(
                BenekStringHelpers.getDateAsString(missionDeadline),
                style: lightTextStyle( textColor: AppColors.benekWhite ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ],
      )
    );
  }
}
