import 'package:benek_kulube/common/widgets/benek_custom_scroll_list_widget.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/presentation/shared/components/pet_search_components/pet_search_result_list/pet_search_pet_card.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
// ignore: unnecessary_import
import 'package:flutter/rendering.dart';
import 'package:flutter_redux/flutter_redux.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class PetSearchResultListCustomScrollViewWidget extends StatefulWidget {
  final double lastChildHeight; // Height of black area on ui ( the container list located in )
  final List<PetModel>? resultData; // Search Result User List
  final String? searchValue;
  final bool isPetSearch; // it also can be recomended users list
  final Function( PetModel ) onPetHoverCallback;
  final Function() onPetHoverExitCallback;

  const PetSearchResultListCustomScrollViewWidget({
    Key? key,
    required this.lastChildHeight,
    required this.resultData,
    this.searchValue,
    required this.isPetSearch,
    required this.onPetHoverCallback,
    required this.onPetHoverExitCallback,
  }) : super(key: key);

  @override
  State<PetSearchResultListCustomScrollViewWidget> createState() => _PetSearchResultListCustomScrollViewWidgetState();
}

class _PetSearchResultListCustomScrollViewWidgetState extends State<PetSearchResultListCustomScrollViewWidget> with TickerProviderStateMixin {
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
        && store.state.petSearchResultList?.totalDataCount != null
        && store.state.petSearchResultList!.totalDataCount! > widget.resultData!.length;
  }

  void requestNextPageIfNeeded( Store<AppState> store ){
    if (shoudSendPaginationRequest) {
      // close states so it's not gonna send same request multiple time
      setState(() {
        shoudSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      // Send Request
      getPetListsNextPageRequest(
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

  Future<void> getPetListsNextPageRequest( Function? callBackAfterRequestDone, Store<AppState> store) async {
    // send request (!!!! search by search value endpoint is different
    // so we will add a condition and send another requst for it later)
    if( widget.isPetSearch && widget.searchValue != null ){
      await store.dispatch(petSearchRequestAction(widget.searchValue!, true));
    }

    // use after request function
    if( callBackAfterRequestDone != null && mounted ){
      callBackAfterRequestDone();
    }
  }

  Widget _buildKulubeUserCard(int index) {
    return KulubePetCard(
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
        onPetHoverCallback: widget.onPetHoverCallback,
        onPetHoverExitCallback: widget.onPetHoverExitCallback
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
