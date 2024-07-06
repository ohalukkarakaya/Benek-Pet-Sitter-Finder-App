import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_list_model.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_result_list/user_search_result_list_custom_scroll_view.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class UserSearchResultList extends StatefulWidget {
  final Store<AppState> store;
  final Function( UserInfo ) onUserHoverCallback;
  final Function() onUserHoverExitCallback;
  const UserSearchResultList({
    Key? key, 
    required this.store,
    required this.onUserHoverCallback,
    required this.onUserHoverExitCallback
  }) : super(key: key);

  @override
  State<UserSearchResultList> createState() => _UserSearchResultListState();
}

class _UserSearchResultListState extends State<UserSearchResultList> {
  late int itemCount;
  List<UserInfo>? resultData;

  @override
  void initState() {
    super.initState();

    Store<AppState> store = AppReduxStore.currentStore!;

    store.dispatch(resetUserSearchDataAction());
    _updateResultData();
  }

  void _updateResultData() {
    resultData = checkIfUserSearch()
        ? widget.store.state.userSearchResultList!.users
        : isRecomendedUserNotEmpty()
            ? widget.store.state.recomendedUsersList!.users
            : null;

    itemCount = resultData?.length ?? 0;
  }

  bool checkIfUserSearch(){
    return widget.store.state.userSearchResultList != null 
        && widget.store.state.userSearchResultList!.users != null 
        && widget.store.state.userSearchResultList!.users!.isNotEmpty;
  }

  bool isRecomendedUserNotEmpty(){
    return widget.store.state.recomendedUsersList != null 
          && widget.store.state.recomendedUsersList!.users != null 
          &&  widget.store.state.recomendedUsersList!.users!.isNotEmpty;
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: 9,
      child: StoreConnector<AppState, UserList?>(
        converter: (store) {
          final UserList? resultDataObject = store.state.userSearchResultList ?? store.state.recomendedUsersList;

          return resultDataObject;
        },
        builder: (context, resultDataObject) {
          List<UserInfo>? resultData = resultDataObject?.users;
          _updateResultData();
          double totalHeight = 0.0;
          totalHeight = 64.0 * itemCount;

          double lastChildHeight = totalHeight + 50 + (20 * (itemCount - 1));

          if (resultData == null || resultData.isEmpty) {
            return const SizedBox.shrink();
          }

          bool isUserSearch = checkIfUserSearch();

          return Column(
            children: [
              Container(
                decoration: BoxDecoration(
                  color: AppColors.benekBlack,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(6.0),
                    topRight: const Radius.circular(6.0),
                    bottomLeft: lastChildHeight <= 678.6
                        ? const Radius.circular(6.0)
                        : const Radius.circular(0.0),
                    bottomRight: lastChildHeight <= 678.6
                        ? const Radius.circular(6.0)
                        : const Radius.circular(0.0),
                  ),
                ),
                height: lastChildHeight <= 678.6 ? lastChildHeight : 678.6,
                padding: const EdgeInsets.all(10.0),
                child: ScrollConfiguration(
                  behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                  // ignore: unnecessary_null_comparison
                  child: resultData != null 
                    && resultData.isNotEmpty
                      ? UserSearchResultListCustomScrollViewWidget(
                          lastChildHeight: lastChildHeight,
                          resultData: resultData,
                          searchValue: isUserSearch ? resultDataObject?.searchValue : null,
                          isUserSearchList: isUserSearch,
                          onUserHoverCallback: widget.onUserHoverCallback,
                          onUserHoverExitCallback: widget.onUserHoverExitCallback
                        )
                      : const SizedBox(),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

}

