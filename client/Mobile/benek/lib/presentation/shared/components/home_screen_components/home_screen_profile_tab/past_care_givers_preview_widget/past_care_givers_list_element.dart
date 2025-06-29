import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../data/models/user_profile_models/user_past_care_givers_model.dart';

class PastCareGiversListElement extends StatelessWidget {
  final UserPastCaregivers pastCareGiverInfo;
  const PastCareGiversListElement({
    super.key,
    required this.pastCareGiverInfo,
  });

  @override
  Widget build(BuildContext context) {

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.only( bottom: 5.0),
                  child: BenekCircleAvatar(
                      isDefaultAvatar: pastCareGiverInfo.careGiver!.profileImg.isDefaultImg,
                      imageUrl: pastCareGiverInfo.careGiver!.profileImg.imgUrl,
                      width: 30,
                      height: 30,
                      borderWidth: 2,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 15.0, top: 10.0),
                  child: BenekCircleAvatar(
                    isDefaultAvatar: pastCareGiverInfo.pet!.petProfileImg.isDefaultImg,
                    imageUrl: pastCareGiverInfo.pet!.petProfileImg.imgUrl,
                    width: 25,
                    height: 25,
                    borderWidth: 2,
                  ),
                ),
              ]
            ),

            const SizedBox(width: 10.0),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  BenekStringHelpers.getDateAsString( pastCareGiverInfo.startDate! ),
                  style: semiBoldTextStyle(
                    textColor: AppColors.benekWhite,
                    textFontSize: 8.0,
                  ),
                ),

                const SizedBox(height: 5),

                Text(
                  BenekStringHelpers.getDateAsString( pastCareGiverInfo.endDate! ),
                  style: semiBoldTextStyle(
                    textColor: AppColors.benekWhite,
                    textFontSize: 8.0,
                  ),
                ),
              ],
            )

          ]
        ),

        Text(
          pastCareGiverInfo.price! == 'Free' ? BenekStringHelpers.locale('volunteer') : pastCareGiverInfo.price!,
          style: semiBoldTextStyle( textColor: AppColors.benekWhite ),
        )
      ],
    );
  }
}
