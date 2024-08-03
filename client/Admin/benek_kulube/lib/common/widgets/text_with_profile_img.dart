import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';

class TextWithProfileImg extends StatelessWidget {
  final String text;
  final UserProfileImg profileImg;

  const TextWithProfileImg({
    super.key,
    required this.text,
    required this.profileImg,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BenekCircleAvatar(
            isDefaultAvatar: profileImg.isDefaultImg!,
            imageUrl: profileImg.imgUrl!,
            width: 30.0,
            height: 30.0,
            borderWidth: 2.0,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: lightTextStyle( textColor: AppColors.benekWhite ),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}