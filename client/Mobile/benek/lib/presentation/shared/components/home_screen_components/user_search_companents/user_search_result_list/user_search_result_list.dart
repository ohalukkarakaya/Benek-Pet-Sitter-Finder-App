import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/data/models/user_profile_models/user_list_model.dart';
import 'package:benek/presentation/shared/components/home_screen_components/user_search_companents/user_search_result_list/user_search_recently_seen_user_row.dart';
import 'package:benek/presentation/shared/components/home_screen_components/user_search_companents/user_search_result_list/user_search_result_list_custom_scroll_view.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

class UserSearchResultList extends StatefulWidget {
  final Function(UserInfo) onUserTapCallback; // Hover yerine tap
  const UserSearchResultList({
    super.key,
    required this.onUserTapCallback,
  });

  @override
  State<UserSearchResultList> createState() => _UserSearchResultListState();
}

class _UserSearchResultListState extends State<UserSearchResultList> {
  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;

    return StoreConnector<AppState, UserList?>(
      converter: (store) {
        return store.state.userSearchResultList ?? store.state.recomendedUsersList;
      },
      builder: (context, resultDataObject) {
        List<UserInfo>? resultData = resultDataObject?.users;

        if (resultData == null || resultData.isEmpty) {
          return const SizedBox.shrink();
        }

        bool hasRecentlySeen = resultDataObject?.recentlySeenUsers != null &&
            resultDataObject!.recentlySeenUsers!.isNotEmpty;

        double containerHeight = hasRecentlySeen
            ? screenHeight * 0.7
            : screenHeight * 0.8;

        return Column(
          children: [
            if (hasRecentlySeen)
              UserSearchRecentlySeenUserRow(
                recentlySeenUsers: resultDataObject.recentlySeenUsers!.reversed.toList(),
                onUserTapCallback: widget.onUserTapCallback,
              ),
            Container(
              decoration: BoxDecoration(
                color: AppColors.benekBlack,
                borderRadius: BorderRadius.circular(12),
              ),
              height: containerHeight,
              padding: const EdgeInsets.all(8),
              child: ScrollConfiguration(
                behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                child: UserSearchResultListCustomScrollViewWidget(
                  lastChildHeight: containerHeight,
                  resultData: resultData,
                  isUserSearchList: StoreProvider.of<AppState>(context).state.userSearchResultList == resultDataObject,
                  searchValue: resultDataObject?.searchValue,
                  onUserTapCallback: widget.onUserTapCallback,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
