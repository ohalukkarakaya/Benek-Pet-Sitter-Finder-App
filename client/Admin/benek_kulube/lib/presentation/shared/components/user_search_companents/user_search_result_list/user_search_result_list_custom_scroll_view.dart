import 'dart:developer';

import 'package:benek_kulube/common/widgets/benek_custom_scroll_list_widget.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_result_list/user_search_user_card.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
// ignore: unnecessary_import
import 'package:flutter/rendering.dart';
import 'package:flutter_redux/flutter_redux.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class UserSearchResultListCustomScrollViewWidget extends StatefulWidget {
  final double lastChildHeight; // Height of black area on ui ( the container list located in )
  final List<UserInfo>? resultData; // Search Result User List
  final String? searchValue;
  final bool isUserSearchList; // it also can be recomended users list

  const UserSearchResultListCustomScrollViewWidget({
    Key? key,
    required this.lastChildHeight,
    required this.resultData,
    this.searchValue,
    required this.isUserSearchList,
  }) : super(key: key);

  @override
  State<UserSearchResultListCustomScrollViewWidget> createState() => _UserSearchResultListCustomScrollViewWidgetState();
}

class _UserSearchResultListCustomScrollViewWidgetState extends State<UserSearchResultListCustomScrollViewWidget> with TickerProviderStateMixin {
  int revealAnimationLastIndex = -1; //index of last element which done its animation
  bool shoudSendPaginationRequest = false; //pagination request controlling state
  bool isWaitingForAsyncRequest = false; //we make it true after we send request and we dont want to send new one because it is gonna be duplicate
  double heightOfRemainingSpaceForWidget = 678.6; //couldn't get it dynamicly

  void checkIfPaginationNeeded(Store<AppState> store, int? index) {
    if (
      _isPaginationNeeded(store, index)
      && !isWaitingForAsyncRequest
    ){
      // We could send request directly in here but if we do, we gonna need
      // to call requestNextPageIfNeeded function in every where so its better
      // to send one request at main builder and control it by 
      // shoudSendPaginationRequest state.
      setState(() {
        shoudSendPaginationRequest = true;
      });
    }
  }


  bool _isPaginationNeeded( Store<AppState> store, int? index ){
    return ( 
            (
              // we dont pass index data if we call this condition in main builder
              // not in visibility detector.
              index != null
              && index == widget.resultData!.length - 3
            )
            // if visibility not changed but list get smaller ( basicly when we call
            // function in main builder and we are not able to reach index data )
            ||  widget.lastChildHeight <= heightOfRemainingSpaceForWidget
          )
          // if there is data waits for us on server :)
          && store.state.recomendedUsersList?.totalDataInServer != null 
          && store.state.recomendedUsersList!.totalDataInServer! > widget.resultData!.length;
  }

  void requestNextPageIfNeeded( Store<AppState> store ){
    if (shoudSendPaginationRequest) {
      // close states so it's not gonna send same request multiple time
      setState(() {
        shoudSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      // Send Request
      getRecomendedUsersNextPageRequest(
        () {
          // Function wich gonna be called after request done
          setState(() {
            isWaitingForAsyncRequest = false;
          });
        },
        // Pass store data
        store
      );
    }
  }

  Future<void> getRecomendedUsersNextPageRequest( 
    Function? callBackAfterRequestDone, 
    Store<AppState> store 
  ) async {
    // send request (!!!! search by search value endpoint is different 
    // so we will add a condition and send another requst for it later)
    if( 
      widget.isUserSearchList
      && widget.searchValue != null
    ){
      await store.dispatch(userSearchRequestAction(widget.searchValue!, true));
    }else{
      await store.dispatch(getRecomendedUsersRequestAction(true));
    }
    
    // use sfter request function
    if( callBackAfterRequestDone != null && mounted ){
      callBackAfterRequestDone();
    }
  }

  Widget _buildKulubeUserCard(int index) {
    return GestureDetector(
      onTap: (){
        // TODO: Add User Selection (SOLVE THE ON TAP PROBLEM !!!DAMN!!!)
        log('User Selection Is Working!');
        // Store<AppState> store = StoreProvider.of<AppState>(context);
        // store.dispatch(setSelectedUserAction(widget.resultData![index]));
      },
      child: KulubeUserCard(
        index: index,
        indexOfLastRevealedItem: revealAnimationLastIndex,
        // userInfo in this case
        resultData: widget.resultData![index],
        onAnimationComplete: () {
          setState(() {
            // If we don't keep index value of list element which
            // done it's animation, we can't make one by one animation
            // smoothly when new element inserted from server side. And
            // also we can't keep this data in widget because we have to 
            // pass this data to all of list elements
            revealAnimationLastIndex = index;
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    checkIfPaginationNeeded(store, null);
    requestNextPageIfNeeded( store );

    return BenekCustomScrollListWidget(
      isShouldNotBeScrollable: widget.lastChildHeight <= heightOfRemainingSpaceForWidget,
      itemDataList: widget.resultData,
      child: (index) => _buildKulubeUserCard(index),
      onVisibilityChangedCB: (visibilityInfo, index){
        checkIfPaginationNeeded(store, index);
      } 
    );
  }
}
