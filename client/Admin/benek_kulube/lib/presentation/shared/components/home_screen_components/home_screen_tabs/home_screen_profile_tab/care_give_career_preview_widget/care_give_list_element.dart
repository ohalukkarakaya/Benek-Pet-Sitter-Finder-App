import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_care_giver_career_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class CareGiveListElement extends StatelessWidget {
  final UserCaregiverCareer careGiveInfo;
  const CareGiveListElement({
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

            const SizedBox(width: 10.0),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Row(
                  children: [
                    Text(
                      BenekStringHelpers.locale('startDate'),
                      style: const TextStyle(
                        color: AppColors.benekWhite,
                        fontSize: 8.0,
                        fontWeight: FontWeight.w400,
                        fontFamily: 'Qanelas',
                      ),
                    ),

                    const SizedBox(width: 5),

                    Text(
                      BenekStringHelpers.getDateAsString( careGiveInfo.startDate! ),
                      style: const TextStyle(
                        color: AppColors.benekWhite,
                        fontSize: 8.0,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Qanelas',
                      ),
                    )
                  ],
                ),

                const SizedBox(height: 5),

                Row(
                  children: [
                    Text(
                      BenekStringHelpers.locale('endDate'),
                      style: const TextStyle(
                        color: AppColors.benekWhite,
                        fontSize: 8.0,
                        fontWeight: FontWeight.w400,
                        fontFamily: 'Qanelas',
                      ),
                    ),

                    const SizedBox(width: 5),

                    Text(
                      BenekStringHelpers.getDateAsString( careGiveInfo.endDate! ),
                      style: const TextStyle(
                        color: AppColors.benekWhite,
                        fontSize: 8.0,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Qanelas',
                      ),
                    )
                  ],
                ),
              ],
            )

          ]
        ),

        Text(
          careGiveInfo.price! == 'Free' ? BenekStringHelpers.locale('volunteer') : careGiveInfo.price!,
          style: const TextStyle(
            color: AppColors.benekWhite,
            fontSize: 12.0,
            fontWeight: FontWeight.w600,
            fontFamily: 'Qanelas',
          ),
        )
      ],
    );
  }
}
