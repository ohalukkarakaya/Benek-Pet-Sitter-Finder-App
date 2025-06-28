import 'package:benek/common/widgets/benek_custom_scroll_list_widget.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/presentation/shared/components/user_search_companents/user_search_result_list/user_search_user_card.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

class UserSearchResultListCustomScrollViewWidget extends StatefulWidget {
  final double lastChildHeight;
  final List<UserInfo>? resultData;
  final String? searchValue;
  final bool isUserSearchList;
  final Function(UserInfo) onUserTapCallback;

  const UserSearchResultListCustomScrollViewWidget({
    Key? key,
    required this.lastChildHeight,
    required this.resultData,
    this.searchValue,
    required this.isUserSearchList,
    required this.onUserTapCallback,
  }) : super(key: key);

  @override
  State<UserSearchResultListCustomScrollViewWidget> createState() => _UserSearchResultListCustomScrollViewWidgetState();
}

class _UserSearchResultListCustomScrollViewWidgetState extends State<UserSearchResultListCustomScrollViewWidget> with TickerProviderStateMixin {
  int revealAnimationLastIndex = -1;
  bool shouldSendPaginationRequest = false;
  bool isWaitingForAsyncRequest = false;
  double heightOfRemainingSpaceForWidget = 500.0; // mobil için daha uygun

  void checkIfPaginationNeeded(Store<AppState> store, int? index) {
    if (_isPaginationNeeded(store, index) && !isWaitingForAsyncRequest) {
      setState(() {
        shouldSendPaginationRequest = true;
      });
    }
  }

  bool _isPaginationNeeded(Store<AppState> store, int? index) {
    return (
        (index != null && index == widget.resultData!.length - 3) ||
        widget.lastChildHeight <= heightOfRemainingSpaceForWidget
    ) &&
        store.state.recomendedUsersList?.totalDataInServer != null &&
        store.state.recomendedUsersList!.totalDataInServer! > widget.resultData!.length;
  }

  void requestNextPageIfNeeded(Store<AppState> store) {
    if (shouldSendPaginationRequest) {
      setState(() {
        shouldSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      getRecomendedUsersNextPageRequest(() {
        setState(() {
          isWaitingForAsyncRequest = false;
        });
      }, store);
    }
  }

  Future<void> getRecomendedUsersNextPageRequest(Function? callBackAfterRequestDone, Store<AppState> store) async {
    if (widget.isUserSearchList && widget.searchValue != null) {
      await store.dispatch(userSearchRequestAction(widget.searchValue!, true));
    } else {
      await store.dispatch(getRecomendedUsersRequestAction(true));
    }

    if (callBackAfterRequestDone != null && mounted) {
      callBackAfterRequestDone();
    }
  }

  Widget _buildKulubeUserCard(int index) {
    return KulubeUserCard(
      index: index,
      indexOfLastRevealedItem: revealAnimationLastIndex,
      resultData: widget.resultData![index],
      onAnimationComplete: () {
        setState(() {
          revealAnimationLastIndex = index;
        });
      },
      onUserTapCallback: widget.onUserTapCallback,
    );
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    checkIfPaginationNeeded(store, null);
    requestNextPageIfNeeded(store);

    return BenekCustomScrollListWidget(
      isShouldNotBeScrollable: widget.lastChildHeight <= heightOfRemainingSpaceForWidget,
      itemDataList: widget.resultData,
      child: (index) => _buildKulubeUserCard(index),
      onVisibilityChangedCB: (visibilityInfo, index) {
        checkIfPaginationNeeded(store, index);
      },
    );
  }
}
