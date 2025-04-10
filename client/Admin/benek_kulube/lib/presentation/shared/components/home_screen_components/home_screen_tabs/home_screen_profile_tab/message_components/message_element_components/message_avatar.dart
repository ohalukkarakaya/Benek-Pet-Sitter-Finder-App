

import 'package:benek_kulube/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

class MessageAvatarWidget extends StatelessWidget {
  final bool shouldDisplayAtLeft;
  final UserProfileImg userProfileImage;

  const MessageAvatarWidget({
    super.key,
    this.shouldDisplayAtLeft = true,
    required this.userProfileImage,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: shouldDisplayAtLeft
          ? Alignment.centerLeft
          : Alignment.centerRight,
      child: BenekCircleAvatar(
        width: 35,
        height: 35,
        radius: 100,
        isDefaultAvatar: userProfileImage.isDefaultImg!,
        imageUrl: userProfileImage.imgUrl!,
      ),
    );
  }
}
