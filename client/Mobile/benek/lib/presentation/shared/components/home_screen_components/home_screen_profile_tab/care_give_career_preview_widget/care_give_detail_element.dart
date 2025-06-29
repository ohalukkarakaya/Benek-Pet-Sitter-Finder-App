import 'package:benek/data/models/user_profile_models/user_care_giver_career_model.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../common/utils/styles.text.dart';


class CareGiveDetailElement extends StatelessWidget {
  final UserCaregiverCareer careGiveInfo;
  const CareGiveDetailElement({
    super.key,
    required this.careGiveInfo,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
            children: [
              Padding(
                padding: const EdgeInsets.only( bottom: 5.0),
                child: BenekCircleAvatar(
                  isDefaultAvatar: careGiveInfo.pet!.petProfileImg.isDefaultImg,
                  imageUrl: careGiveInfo.pet!.petProfileImg.imgUrl,
                  width: 35,
                  height: 35,
                  borderWidth: 2,
                ),
              ),

              const SizedBox(width: 12.0),

              Text(
                careGiveInfo.pet!.name!,
                style: semiBoldTextStyle(
                  textColor: AppColors.benekWhite,
                  textFontSize: 12.0,
                ),
              ),
            ]
        ),

        Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Row(
                  children: [
                    Text(
                      BenekStringHelpers.locale('startDate'),
                      style: regularTextStyle(
                        textColor: AppColors.benekWhite,
                        textFontSize: 8.0,
                      ),
                    ),

                    const SizedBox(width: 5),

                    Text(
                      BenekStringHelpers.getDateAsString( careGiveInfo.startDate! ),
                      style: semiBoldTextStyle(
                        textColor: AppColors.benekWhite,
                        textFontSize: 8.0,
                      ),
                    )
                  ],
                ),

                const SizedBox(height: 5),

                Row(
                  children: [
                    Text(
                      BenekStringHelpers.locale('endDate'),
                      style: regularTextStyle(
                        textColor: AppColors.benekWhite,
                        textFontSize: 8.0,
                      ),
                    ),

                    const SizedBox(width: 5),

                    Text(
                      BenekStringHelpers.getDateAsString( careGiveInfo.endDate! ),
                      style: semiBoldTextStyle(
                        textColor: AppColors.benekWhite,
                        textFontSize: 8.0,
                      ),
                    )
                  ],
                ),
              ],
            ),
            const SizedBox( width: 30 ),
            Text(
              careGiveInfo.price! == 'Free' ? BenekStringHelpers.locale('volunteer') : careGiveInfo.price!,
              style: semiBoldTextStyle( textColor: AppColors.benekWhite ),
            ),
          ],
        )
      ],
    );
  }
}
