import 'dart:developer';

import 'package:flutter/material.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../../common/widgets/benek_custom_scroll_list_widget.dart';
import '../../../../../../data/models/user_profile_models/user_info_model.dart';
import 'employee_card.dart';

class EmployeesResultListCustomScrollViewWidget extends StatefulWidget {
  final List<UserInfo>? resultData;

  const EmployeesResultListCustomScrollViewWidget({
    Key? key,
    required this.resultData,
  }) : super(key: key);

  @override
  State<EmployeesResultListCustomScrollViewWidget> createState() => _EmployeesResultListCustomScrollViewWidgetState();
}

class _EmployeesResultListCustomScrollViewWidgetState extends State<EmployeesResultListCustomScrollViewWidget> with TickerProviderStateMixin {
  int revealAnimationLastIndex = -1;
  bool shoudSendPaginationRequest = false;
  bool isWaitingForAsyncRequest = false;
  double heightOfRemainingSpaceForWidget = 678.6;

  void checkIfPaginationNeeded(Store<AppState> store, int? index) {
    if (
    _isPaginationNeeded(store, index)
        && !isWaitingForAsyncRequest
    ){
      setState(() {
        shoudSendPaginationRequest = true;
      });
    }
  }

  bool _isPaginationNeeded(Store<AppState> store, int? index){
    return (
        (index != null && index == widget.resultData!.length - 3) || widget.resultData!.length <= 5
    ) && store.state.employees != null
        && store.state.employees!.users!.length < (store.state.employees!.totalDataInServer ?? 999999);
  }

  void requestNextPageIfNeeded(Store<AppState> store){
    if (shoudSendPaginationRequest) {
      setState(() {
        shoudSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      store.dispatch(getEmployeesAction(true));

      Future.delayed(const Duration(milliseconds: 1000), () {
        if (mounted) {
          setState(() {
            isWaitingForAsyncRequest = false;
          });
        }
      });
    }
  }

  Widget _buildKulubeUserCard(int index) {
    return EmployeeCard(
      index: index,
      indexOfLastRevealedItem: revealAnimationLastIndex,
      resultData: widget.resultData![index],
      onAnimationComplete: () {
        setState(() {
          revealAnimationLastIndex = index;
        });
      },
      onUserClickCallback: (userInfo) {
        final store = StoreProvider.of<AppState>(context);
        store.dispatch(setSelectedUserAction(userInfo));
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = StoreProvider.of<AppState>(context);

    checkIfPaginationNeeded(store, null);
    requestNextPageIfNeeded(store);

    return BenekCustomScrollListWidget(
      isShouldNotBeScrollable: false,
      itemDataList: widget.resultData,
      child: (index) => _buildKulubeUserCard(index),
      onVisibilityChangedCB: (visibilityInfo, index) {
        checkIfPaginationNeeded(store, index);
      },
    );
  }
}