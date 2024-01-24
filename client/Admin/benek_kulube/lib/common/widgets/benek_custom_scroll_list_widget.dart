import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_result_list/user_search_user_card.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:visibility_detector/visibility_detector.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class BenekCustomScrollListWidget extends StatefulWidget {
  final double lastChildHeight;
  final List<UserInfo>? resultData;

  const BenekCustomScrollListWidget({
    Key? key,
    required this.lastChildHeight,
    required this.resultData,
  }) : super(key: key);

  @override
  State<BenekCustomScrollListWidget> createState() => _BenekCustomScrollListWidgetState();
}

class _BenekCustomScrollListWidgetState extends State<BenekCustomScrollListWidget> with TickerProviderStateMixin {
  late ScrollController _controller;
  var rate = 1.0;
  var old = 0.0;
  int revealAnimationLastIndex = -1;
  bool shoudSendPaginationRequest = false;
  bool isWaitingForAsyncRequest = false;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
  }

  void checkPagination(Store<AppState> store, int index) {
    if (
      _isPaginationNeeded(store, index)
      && !isWaitingForAsyncRequest
    ) {
      setState(() {
        shoudSendPaginationRequest = true;
      });
    }
  }

  bool _isPaginationNeeded( Store<AppState> store, int index ){
    return index == widget.resultData!.length - 3 &&
        store.state.recomendedUsersList?.totalDataInServer != null &&
        store.state.recomendedUsersList!.totalDataInServer! > widget.resultData!.length;
  }

  void requestNextPageIfNeeded( Store<AppState> store ){
    if (shoudSendPaginationRequest) {
      setState(() {
        shoudSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      getRecomendedUsersNextPageRequest(
        () {
          setState(() {
            isWaitingForAsyncRequest = false;
          });
        },
        store
      );
    }
  }

  Future<void> getRecomendedUsersNextPageRequest( Function? callBack, Store<AppState> store ) async {
    await store.dispatch(getRecomendedUsersRequestAction(true));
    if( callBack != null && mounted ){
      callBack();
    }
  }

   Widget _buildAnimatedPadding( Widget? child ){
    return AnimatedPadding(
      padding: EdgeInsets.only(
        left: 10.0,
        right: 10.0,
        top: _controller.position.userScrollDirection == ScrollDirection.forward
          ? ((rate + 10).abs() > 80.0) ? 80.0 : (rate + 10.0).abs()
          : 10.0,
        bottom: _controller.position.userScrollDirection == ScrollDirection.reverse
          ? ((rate + 10).abs() > 80.0) ? 80.0 : (rate + 10.0).abs()
          : 10.0
      ),
      duration: const Duration(milliseconds: 375),
      curve: Curves.easeOut,
      child: child ?? const SizedBox(),
    );
  }

  Widget _buildVisibilityDetector(Store<AppState> store, Widget child, int index) {
    return VisibilityDetector(
      key: Key(index.toString()),
      onVisibilityChanged: (visibilityInfo) {
        checkPagination(store, index);
      },
      child: child,
    );
  }

  Widget _buildKulubeUserCard(int index) {
    return KulubeUserCard(
      index: index,
      indexOfLastRevealedItem: revealAnimationLastIndex,
      onAnimationComplete: () {
        setState(() {
          revealAnimationLastIndex = index;
        });
      },
      resultData: widget.resultData![index]
    );
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    requestNextPageIfNeeded( store );

    return NotificationListener<ScrollNotification>(
      onNotification: (scrollNotification) {
        var curent = scrollNotification.metrics.pixels;
        var pixels = scrollNotification.metrics.pixels;
        var max = scrollNotification.metrics.maxScrollExtent;
        var min = scrollNotification.metrics.minScrollExtent;

        setState(() {
          if (curent > 10) {
            rate = (curent - old).abs();
            old = curent;
          }

          if (pixels >= max - 50) {
            rate = 0.0;
          }

          if (pixels <= min + 50) {
            rate = 0.0;
          }
        });

        return true;
      },
      child: CustomScrollView(
        physics: widget.lastChildHeight <= 678.6 ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics(),
        controller: _controller,
        slivers: [
          SliverList(
            delegate: SliverChildBuilderDelegate(
              childCount: widget.resultData?.length ?? 0,
              (context, index) {
                if (widget.resultData != null && index < widget.resultData!.length) {
                  return _buildVisibilityDetector(
                    store,
                    _buildAnimatedPadding(
                      _buildKulubeUserCard(index)
                    ),
                    index,
                  );
                } else {
                  return const SizedBox.shrink();
                }
              }
            ),
          )
        ],
      ),
    );
  }
}
