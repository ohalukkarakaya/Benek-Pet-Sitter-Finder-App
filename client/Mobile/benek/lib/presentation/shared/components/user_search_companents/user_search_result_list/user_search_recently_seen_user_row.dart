import 'package:flutter/material.dart';
import '../../../../../data/models/user_profile_models/user_info_model.dart';
import 'user_search_recently_seen_user_card.dart';

class UserSearchRecentlySeenUserRow extends StatelessWidget {
  final List<UserInfo>? recentlySeenUsers;
  final Function(UserInfo)? onUserTapCallback;

  const UserSearchRecentlySeenUserRow({
    super.key,
    this.recentlySeenUsers,
    this.onUserTapCallback,
  });

  @override
  Widget build(BuildContext context) {
    if (recentlySeenUsers == null || recentlySeenUsers!.isEmpty) {
      return const SizedBox.shrink();
    }

    int itemCount = recentlySeenUsers!.length > 10 ? 10 : recentlySeenUsers!.length;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: SizedBox(
        height: 90, // Mobil için ideal yükseklik
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          itemCount: itemCount,
          separatorBuilder: (context, index) => const SizedBox(width: 8),
          itemBuilder: (context, index) {
            final user = recentlySeenUsers![index];
            return UserSearchRecentlySeenUserCard(
              userInfo: user,
              onUserTapCallback: onUserTapCallback,
            );
          },
        ),
      ),
    );
  }
}
