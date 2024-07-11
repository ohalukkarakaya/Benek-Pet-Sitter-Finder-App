import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_result_list/user_search_recently_seen_user_card.dart';
import 'package:flutter/widgets.dart';

import '../../../../../data/models/user_profile_models/user_info_model.dart';

class UserSearchRecentlySeenUserRow extends StatelessWidget {
  final List<UserInfo>? recentlySeenUsers;
  final Function( UserInfo )? onUserHoverCallback;
  final Function()? onUserHoverExitCallback;

  const UserSearchRecentlySeenUserRow({
    super.key,
    this.recentlySeenUsers,
    this.onUserHoverCallback,
    this.onUserHoverExitCallback
  });

  @override
  Widget build(BuildContext context) {

    int itemCount = recentlySeenUsers != null
        ? recentlySeenUsers!.length > 6
          ? 6
          : recentlySeenUsers!.length
        : 0;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: SizedBox(
        height: 100.0,
        child: Row(
          mainAxisAlignment: itemCount <= 5 ? MainAxisAlignment.start : MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: List.generate(
            itemCount,
            ( index ){
                return UserSearchRecentlySeenUserCard(
                  itemCount: itemCount,
                  index: index,
                  userInfo: recentlySeenUsers![index],
                  onUserHoverCallback: onUserHoverCallback,
                  onUserHoverExitCallback: onUserHoverExitCallback,
                );
            }
          ),
        ),
      ),
    );
  }
}
