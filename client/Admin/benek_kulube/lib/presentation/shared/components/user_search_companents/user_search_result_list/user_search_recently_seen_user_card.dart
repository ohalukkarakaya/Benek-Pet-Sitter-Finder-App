import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/widgets.dart';

import '../../../../../common/constants/app_colors.dart';
import '../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../benek_circle_avatar/benek_circle_avatar.dart';

class UserSearchRecentlySeenUserCard extends StatefulWidget {
  final int itemCount;
  final int index;
  final UserInfo userInfo;
  final Function( UserInfo )? onUserHoverCallback;
  final Function()? onUserHoverExitCallback;


  const UserSearchRecentlySeenUserCard({
    super.key,
    required this.itemCount,
    required this.index,
    required this.userInfo,
    this.onUserHoverCallback,
    this.onUserHoverExitCallback
  });

  @override
  State<UserSearchRecentlySeenUserCard> createState() => _UserSearchRecentlySeenUserCardState();
}

class _UserSearchRecentlySeenUserCardState extends State<UserSearchRecentlySeenUserCard> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
          right: widget.index != widget.itemCount - 1
              ? 5.0
              : 0.0
      ),
      child: MouseRegion(
        onHover: ( event ){
          widget.onUserHoverCallback!(widget.userInfo);
          setState(() {
            isHovering = true;
          });
        },
        onExit: (event) {
          widget.onUserHoverExitCallback!();
          setState(() {
            isHovering = false;
          });
        },
        child: Container(
            width: 110.0,
            padding: const EdgeInsets.all(10.0),
            decoration: BoxDecoration(
              color: isHovering ? AppColors.benekLightBlue : AppColors.benekBlack,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(6.0),
                topRight: Radius.circular(6.0),
                bottomLeft: Radius.circular(6.0),
                bottomRight: Radius.circular(6.0),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                BenekCircleAvatar(
                  width: 50.0,
                  height: 50.0,
                  radius: 30.0,
                  isDefaultAvatar: widget.userInfo.profileImg!.isDefaultImg!,
                  imageUrl: widget.userInfo.profileImg!.imgUrl!,
                  bgColor: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                ),
                const SizedBox(height: 10.0),
                Text(
                  widget.userInfo.userName!,
                  style: TextStyle(
                      fontFamily: defaultFontFamily(),
                      fontSize: 12.0,
                      fontWeight: isHovering ? getFontWeight('medium') : getFontWeight('regular'),
                      color: isHovering ? AppColors.benekBlack : null
                  ),
                  overflow: TextOverflow.ellipsis,
                  softWrap: false,
                ),
              ],
            )
        ),
      ),
    );
  }
}
