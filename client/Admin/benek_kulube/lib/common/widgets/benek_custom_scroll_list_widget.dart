import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_result_list/user_search_user_card.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class BenekCustomScrollListWidget extends StatefulWidget {
  final double lastChildHeight;
  final List<GlobalKey<State<StatefulWidget>>> itemKeys;
  const BenekCustomScrollListWidget({super.key, required this.itemKeys, required this.lastChildHeight});

  @override
  State<BenekCustomScrollListWidget> createState() => _BenekCustomScrollListWidgetState();
}

class _BenekCustomScrollListWidgetState extends State<BenekCustomScrollListWidget> with TickerProviderStateMixin {

  late ScrollController _controller;
  var rate = 1.0;
  var old = 0.0;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
  }

  @override
  Widget build(BuildContext context) {

    Store<AppState> store = StoreProvider.of<AppState>(context);
    List<UserInfo>? resultData = store.state.userSearchResultList != null
      && store.state.userSearchResultList!.users != null
      && store.state.userSearchResultList!.users!.isNotEmpty
          ? store.state.userSearchResultList!.users
          : store.state.userSearchemptyStateList!.users;

    return NotificationListener<ScrollNotification>(
    
      onNotification: (scrollNotification){
        var curent = scrollNotification.metrics.pixels;
        var pixels = scrollNotification.metrics.pixels;
        var max = scrollNotification.metrics.maxScrollExtent;
        var min = scrollNotification.metrics.minScrollExtent;
    
        setState(() {
          if(curent > 10){
            rate = (curent - old).abs();
            old = curent;
          }
    
          if( pixels >= max - 50 ){
            rate = 0.0; 
          }
    
          if( pixels <= min + 50 ){
            rate = 0.0;
          }
        });
    
        return true;
      },
    
      child: CustomScrollView(
        physics: widget.lastChildHeight <= 678.6 
          ? const NeverScrollableScrollPhysics() 
          : const BouncingScrollPhysics(),
        controller: _controller,
        slivers: [
          SliverList(
            delegate: SliverChildBuilderDelegate(
              childCount: resultData!.length,
              (constext, index){
                return AnimatedPadding(
                  padding: EdgeInsets.only(
                    left: 10.0,
                    right: 10.0,
    
                    // scroll animation trick :D
                    top: ((rate + 10).abs() > 80.0) ? 80.0 : (rate + 10.0).abs(),
                  ), 
                  duration: const Duration(milliseconds: 375),
                  curve: Curves.easeOut,
                  child: KulubeUserCard(
                    itemKey: widget.itemKeys[index], 
                    resultData: resultData[index],
                  )
                );
              }
            ),
          )
        ],
      ),
    );
  }
}