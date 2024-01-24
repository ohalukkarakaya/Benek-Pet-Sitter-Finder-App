import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/widgets/benek_custom_scroll_list_widget.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class UserSearchResultList extends StatefulWidget {
  final Store<AppState> store;
  const UserSearchResultList({Key? key, required this.store}) : super(key: key);

  @override
  State<UserSearchResultList> createState() => _UserSearchResultListState();
}

class _UserSearchResultListState extends State<UserSearchResultList> {
  late int itemCount;
  List<UserInfo>? resultData;

  @override
  void initState() {
    super.initState();
    _updateResultData();
  }

  void _updateResultData() {
    resultData = widget.store.state.userSearchResultList != null &&
        widget.store.state.userSearchResultList!.users != null &&
        widget.store.state.userSearchResultList!.users!.isNotEmpty
        ? widget.store.state.userSearchResultList!.users
        : widget.store.state.recomendedUsersList != null &&
            widget.store.state.recomendedUsersList!.users != null &&
            widget.store.state.recomendedUsersList!.users!.isNotEmpty
            ? widget.store.state.recomendedUsersList!.users
            : null;

    itemCount = resultData?.length ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: 9,
      child: StoreConnector<AppState, List<UserInfo>?>(
        converter: (store) {
          final List<UserInfo>? resultData =
              store.state.userSearchResultList?.users ??
              store.state.recomendedUsersList?.users;

          return resultData;
        },
        builder: (context, resultData) {
          _updateResultData();

          double totalHeight = 0.0;

          totalHeight = 64.0 * itemCount;

          double lastChildHeight = totalHeight + 50 + (20 * (itemCount - 1));

          if (resultData == null || resultData.isEmpty) {
            return const SizedBox.shrink();
          }

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
                      ? BenekCustomScrollListWidget(
                          lastChildHeight: lastChildHeight,
                          resultData: resultData,
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

