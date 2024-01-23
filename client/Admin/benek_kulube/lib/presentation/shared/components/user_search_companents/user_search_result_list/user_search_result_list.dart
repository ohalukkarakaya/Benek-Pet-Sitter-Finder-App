import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/widgets/benek_custom_scroll_list_widget.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class UserSearchResultList extends StatefulWidget {
  final Store<AppState> store;
  const UserSearchResultList({super.key, required this.store});

  @override
  State<UserSearchResultList> createState() => _UserSearchResultListState();
}

class _UserSearchResultListState extends State<UserSearchResultList> {
  late int itemCount;
  double childHeight = 0.0;
  List<GlobalKey> itemKeys = [];
  List<UserInfo>? resultData;

  @override
  void initState() {
    super.initState();
    itemCount = widget.store.state.userSearchResultList != null
    && widget.store.state.userSearchResultList!.users != null
    && widget.store.state.userSearchResultList!.users!.isNotEmpty
        ? widget.store.state.userSearchResultList!.users!.length
        : widget.store.state.userSearchemptyStateList!.users!.length;

    itemKeys = List.generate(itemCount, (index) => GlobalKey());
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      double totalHeight = 0.0;

      if( itemKeys[0].currentContext != null ){
        final RenderBox renderBox = itemKeys[0].currentContext!.findRenderObject() as RenderBox;
        totalHeight = renderBox.size.height * itemCount;
      }

      setState(() {
        childHeight = totalHeight;
      });
    });
  }

  @override
  Widget build(BuildContext context){

    setState(() {
      resultData = widget.store.state.userSearchResultList != null
        && widget.store.state.userSearchResultList!.users != null
        && widget.store.state.userSearchResultList!.users!.isNotEmpty
            ? widget.store.state.userSearchResultList!.users!
            : widget.store.state.userSearchemptyStateList!.users!;

      itemCount = resultData!.length;
    });
    
    double lastChildHeight = childHeight + 50 + (10 * (itemCount - 1));

    return Expanded(
      flex: 9,
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
              color: AppColors.benekBlack,
              borderRadius: BorderRadius.only( 
                topLeft: const Radius.circular( 6.0 ), 
                topRight: const Radius.circular( 6.0 ),
                bottomLeft: lastChildHeight <= 678.6 
                              ? const Radius.circular( 6.0 ) 
                              : const Radius.circular( 0.0 ),
                bottomRight: lastChildHeight <= 678.6 
                                ? const Radius.circular( 6.0 ) 
                                : const Radius.circular( 0.0 ),
              ),
            ),
            height:  lastChildHeight <= 678.6 ? lastChildHeight : 678.6,
            padding: const EdgeInsets.all(10.0),
            child: ScrollConfiguration(
              behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
              child: BenekCustomScrollListWidget(
                itemKeys: itemKeys,
                lastChildHeight: lastChildHeight
              )
            ),
          ),
        ],
      ),
    );
  }
}