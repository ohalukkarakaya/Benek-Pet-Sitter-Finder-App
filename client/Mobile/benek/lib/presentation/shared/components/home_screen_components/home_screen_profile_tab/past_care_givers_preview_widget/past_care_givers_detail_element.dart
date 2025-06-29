import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../data/models/user_profile_models/user_past_care_givers_model.dart';

class PastCareGiversDetailElement extends StatelessWidget {
  final UserPastCaregivers pastCareGiverInfo;
  const PastCareGiversDetailElement({
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
                        width: 35,
                        height: 35,
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

              const SizedBox(width: 12.0),

              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    BenekStringHelpers.getUsersFullName(pastCareGiverInfo.careGiver!.identity!.firstName!, pastCareGiverInfo.careGiver!.identity!.lastName!, pastCareGiverInfo.careGiver!.identity!.middleName),
                    style: regularTextStyle(
                      textColor: AppColors.benekWhite,
                      textFontSize: 10.0,
                    ),
                  ),

                  Row(
                    children: [
                      Text(
                        pastCareGiverInfo.careGiver!.userName!,
                        style: semiBoldTextStyle(
                          textColor: AppColors.benekWhite,
                          textFontSize: 12.0,
                        ),
                      ),
                      const SizedBox(width: 5),
                      
                      const Icon(
                          BenekIcons.right,
                        size: 8,
                      ),
                      
                      const SizedBox(width: 7),
                      Text(
                        pastCareGiverInfo.pet!.name!,
                        style: semiBoldTextStyle(
                          textColor: AppColors.benekWhite,
                          textFontSize: 12.0,
                        ),
                      ),
                    ],
                  ),
                ],
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
                      BenekStringHelpers.getDateAsString( pastCareGiverInfo.startDate! ),
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
                      BenekStringHelpers.getDateAsString( pastCareGiverInfo.endDate! ),
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
              pastCareGiverInfo.price! == 'Free' ? BenekStringHelpers.locale('volunteer') : pastCareGiverInfo.price!,
              style: semiBoldTextStyle( textColor: AppColors.benekWhite ),
            ),
          ],
        )
      ],
    );
  }
}
