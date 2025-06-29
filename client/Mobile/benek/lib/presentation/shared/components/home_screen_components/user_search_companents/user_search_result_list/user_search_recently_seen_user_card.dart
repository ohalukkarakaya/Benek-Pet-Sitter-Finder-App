import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import '../../../../../../common/constants/app_colors.dart';
import '../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../benek_circle_avatar/benek_circle_avatar.dart';

class UserSearchRecentlySeenUserCard extends StatelessWidget {
  final UserInfo userInfo;
  final Function(UserInfo)? onUserTapCallback;

  const UserSearchRecentlySeenUserCard({
    super.key,
    required this.userInfo,
    this.onUserTapCallback,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    // Kart genişliğini ekran boyutuna göre ayarla
    double cardWidth = screenWidth < 400 ? 80.0 : 90.0;
    double avatarSize = screenWidth < 400 ? 45.0 : 50.0;
    double fontSize = screenWidth < 400 ? 11.0 : 12.0;

    return GestureDetector(
      onTap: () => onUserTapCallback?.call(userInfo),
      child: Container(
        width: cardWidth,
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlack,
          borderRadius: BorderRadius.circular(8.0),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min, // 🔥 içerik kadar yüksek
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            BenekCircleAvatar(
              width: avatarSize,
              height: avatarSize,
              radius: avatarSize / 2,
              isDefaultAvatar: userInfo.profileImg!.isDefaultImg!,
              imageUrl: userInfo.profileImg!.imgUrl!,
              bgColor: AppColors.benekWhite,
            ),
            const SizedBox(height: 8.0),
            Text(
              userInfo.userName!,
              style: TextStyle(
                fontFamily: defaultFontFamily(),
                fontSize: fontSize,
                fontWeight: getFontWeight('regular'),
                color: AppColors.benekWhite,
              ),
              overflow: TextOverflow.ellipsis,
              softWrap: false,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}