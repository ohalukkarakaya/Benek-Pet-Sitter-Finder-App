import 'package:flutter/material.dart';

import '../../../../../../../data/models/user_profile_models/user_profile_image_model.dart';
import '../../../../benek_circle_avatar/benek_circle_avatar.dart';

class HomeScreenHomeRightTab extends StatelessWidget {
  final UserProfileImg profileImg;
  const HomeScreenHomeRightTab({
    super.key,
    required this.profileImg
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Padding(
            padding: const EdgeInsets.only(
                right: 40.0,
                top: 50.0,
                bottom: 70.0
            ),
            child: BenekCircleAvatar(
              width: 50,
              height: 50,
              radius: 100,
              isDefaultAvatar: profileImg.isDefaultImg!,
              imageUrl: profileImg.imgUrl!,
            )
        ),
        Image.asset(
          'assets/images/saluting_dog.png',
          width: 350,
        ),
      ],
    );
  }
}
