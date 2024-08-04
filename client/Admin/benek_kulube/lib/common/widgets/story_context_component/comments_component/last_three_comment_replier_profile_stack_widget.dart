import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/widgets.dart';

import '../../../../data/models/user_profile_models/user_info_model.dart';

class LastThreeCommentReplierProfileStackWidget extends StatelessWidget {
  final double size;
  final List<UserInfo> users;
  const LastThreeCommentReplierProfileStackWidget({
    super.key,
    required this.size,
    required this.users,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        children: [
          Positioned(
            right: 0,
            top: 0,
            child: BenekCircleAvatar(
              isDefaultAvatar: users[0].profileImg!.isDefaultImg!,
              imageUrl: users[0].profileImg!.imgUrl!,
              width: size / 2,
              height: size / 2,
              borderWidth: 2.0,
            )
          ),

          users.length > 1
            ? Positioned(
                left: 0,
                top: size / 2.7,
                child: BenekCircleAvatar(
                  isDefaultAvatar: users[1].profileImg!.isDefaultImg!,
                  imageUrl: users[1].profileImg!.imgUrl!,
                  width: size / 2.3,
                  height: size / 2.3,
                  borderWidth: 1.5,
                )
            )
            : const SizedBox(),

          users.length > 2
              ? Positioned(
              left: size / 2.0,
              bottom: 0,
              child: BenekCircleAvatar(
                isDefaultAvatar: users[2].profileImg!.isDefaultImg!,
                imageUrl: users[2].profileImg!.imgUrl!,
                width: size / 2.8,
                height: size / 2.8,
                borderWidth: 1.0,
              )
          )
              : const SizedBox(),
        ],
      ),
    );
  }
}
