import 'dart:developer';

import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:benek_kulube/presentation/shared/components/loading_components/benek_loading_component.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_bar/user_search_bar.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_result_list/user_search_result_list.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class KulubeUserSearchScreen extends StatefulWidget {
  final bool isForUserProfile;
  const KulubeUserSearchScreen({
    super.key,
    this.isForUserProfile = true
  });

  @override
  State<KulubeUserSearchScreen> createState() => _KulubeUserSearchScreenState();
}

class _KulubeUserSearchScreenState extends State<KulubeUserSearchScreen> {
  bool shouldPop = false;
  bool didRequestDone = false;
  UserInfo? hoveringUser;
  final FocusNode _focusNode = FocusNode();

  Function()? _onUserHoverCallback(UserInfo user){
      setState(() {
        hoveringUser = user;
      });
      return null;
  }

  Function()? _onUserHoverExitCallback(){
      setState(() {
        hoveringUser = null;
      });
      return null;
  }

  Future<void> getRecomendedUsersRequestAsync(Function callback) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    await store.dispatch(getRecomendedUsersRequestAction(false));
    if( mounted ){
      callback();
    }
  }

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_onFocusChanged);
    
    getRecomendedUsersRequestAsync(
      (){
        setState(() {
          didRequestDone = true;
        });
      }
    );
  }

  void _onFocusChanged(){
    if (!_focusNode.hasFocus){
       setState(() {
          shouldPop = true;
        });
    }
  }

  void _updateSelectedUser(UserInfo user) async {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    await store.dispatch(SetRecentlySeenUserAction(user));
    await store.dispatch(setSelectedUserAction(null));
    Navigator.pop(context);
    await Future.delayed(const Duration(milliseconds: 100));
    await store.dispatch(setSelectedUserAction(user));
  }

  @override
  Widget build(BuildContext context) {

    final Store<AppState> store = StoreProvider.of<AppState>(context);

    if( shouldPop ){
      store.dispatch(resetUserSearchDataAction());
      setState(() {
        shouldPop = false;
      });

      if( hoveringUser != null ){
        if( widget.isForUserProfile ){
          _updateSelectedUser(hoveringUser!);
        }else{
          Navigator.of(context).pop(hoveringUser);
        }
      }else{
        Navigator.pop(context);
      }
    }

    return BenekBluredModalBarier(
      isDismissible: false,
      onDismiss: () async {
        Navigator.pop(context);
      },

      child: KeyboardListener(
        focusNode: _focusNode,
        onKeyEvent: (KeyEvent event){
          if(
            event is KeyDownEvent
            && event.logicalKey == LogicalKeyboardKey.escape
          ){
              setState(() {
                hoveringUser = null;
                shouldPop = true;
              });
          }
        },
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Padding(
            padding: const EdgeInsets.only( right: 250.0, left: 250.0, top: 30.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const UserSearchBarTextFieldWidget(),
                const SizedBox(height: 16.0),
                (
                  (
                    store.state.userSearchResultList != null
                    && store.state.userSearchResultList!.users != null
                    && store.state.userSearchResultList!.users!.isNotEmpty
                  ) 
                  || (
                    store.state.recomendedUsersList != null
                    && store.state.recomendedUsersList!.users != null
                    && store.state.recomendedUsersList!.users!.isNotEmpty
                  )
                )
                    ? UserSearchResultList(
                      store: store,
                      onUserHoverCallback: _onUserHoverCallback,
                      onUserHoverExitCallback: _onUserHoverExitCallback,
                    )
                    : const Expanded(
                      flex: 9,
                      child: Center(
                        child: BenekLoadingComponent(
                          isDark: true,
                          width: 140.0,
                          height: 140.0,
                        ),
                      ),
                    ),
              ],
            )
          ),
        ),
      ),
    );
  }
}