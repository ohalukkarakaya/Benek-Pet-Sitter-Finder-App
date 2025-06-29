import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/data/models/user_profile_models/star_data_model.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
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
                        width: 35,
                        height: 35,
                        borderWidth: 2,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 22.0, top: 10.0),
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

              const SizedBox(width: 12.0),

              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    BenekStringHelpers.getUsersFullName(starData.owner!.identity!.firstName!, starData.owner!.identity!.lastName!, starData.owner!.identity!.middleName),
                    style: regularTextStyle(
                      textColor: AppColors.benekWhite,
                      textFontSize: 10.0,
                    ),
                  ),

                  Text(
                    starData.owner!.userName!,
                    style: semiBoldTextStyle(
                      textColor: AppColors.benekWhite,
                      textFontSize: 12.0,
                    ),
                  ),
                ],
              ),
            ]
        ),

        Row(
          children: [
            Text(
              BenekStringHelpers.getDateAsString(starData.date!),
              style: regularTextStyle(
                textColor: AppColors.benekWhite,
                textFontSize: 12.0,
              ),
            ),
            const SizedBox(width: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(
                  5,
                      (index){
                    return Padding(
                      padding: const EdgeInsets.all(5.0),
                      child: Icon(
                        Icons.star,
                        color: index < starData.star!
                            ? AppColors.benekWhite
                            : AppColors.benekDarkGrey,
                        size: 20,
                      ),
                    );
                  }
              ),
            ),
          ],
        ),
      ],
    );
  }
}
