import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/data/models/user_profile_models/star_data_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/styles.text.dart';

class BenekProfileStarDetailStarDataCard extends StatelessWidget {
  final StarData starData;
  const BenekProfileStarDetailStarDataCard({
    super.key,
    required this.starData,
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
                        isDefaultAvatar: starData.owner!.profileImg!.isDefaultImg!,
                        imageUrl: starData.owner!.profileImg!.imgUrl!,
                        width: 30,
                        height: 30,
                        borderWidth: 2,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 15.0, top: 10.0),
                      child: BenekCircleAvatar(
                        isDefaultAvatar: starData.pet!.petProfileImg!.isDefaultImg!,
                        imageUrl: starData.pet!.petProfileImg!.imgUrl!,
                        width: 25,
                        height: 25,
                        borderWidth: 2,
                      ),
                    ),
                  ]
              ),

              const SizedBox(width: 10.0),

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
                    BenekStringHelpers.getDateAsString( starData.date! ),
                    style: semiBoldTextStyle(
                      textColor: AppColors.benekWhite,
                      textFontSize: 12.0,
                    ),
                  )
                ],
              ),

            ]
        ),

        Text(
          starData.star.toString(),
          style: semiBoldTextStyle( textColor: AppColors.benekWhite ),
        )
      ],
    );

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        BenekCircleAvatar(
            isDefaultAvatar: starData.owner!.profileImg!.isDefaultImg!,
            imageUrl: starData.owner!.profileImg!.imgUrl!,
        ),

        const SizedBox(width: 16.0),

        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              BenekStringHelpers.getUsersFullName(
                  starData.owner!.identity!.firstName!,
                  starData.owner!.identity!.lastName!,
                starData.owner!.identity!.middleName!,
              ),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 4.0),

            Text(
              starData.owner!.userName!,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),

        const SizedBox(width: 16.0),

        BenekCircleAvatar(
          isDefaultAvatar: starData.pet!.petProfileImg!.isDefaultImg!,
          imageUrl: starData.pet!.petProfileImg!.imgUrl!,
        ),

        const SizedBox(width: 4.0),

        Text(
          starData.pet!.name!,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ]
    );
  }
}
