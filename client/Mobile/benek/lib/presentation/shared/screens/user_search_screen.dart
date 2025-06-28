import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:benek/presentation/shared/components/loading_components/benek_loading_component.dart';
import 'package:benek/presentation/shared/components/user_search_companents/user_search_bar/user_search_bar.dart';
import 'package:benek/presentation/shared/components/user_search_companents/user_search_result_list/user_search_result_list.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_redux_store.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class KulubeUserSearchScreen extends StatefulWidget {
  final bool isForUserProfile;
  const KulubeUserSearchScreen({super.key, this.isForUserProfile = true});

  @override
  State<KulubeUserSearchScreen> createState() => _KulubeUserSearchScreenState();
}

class _KulubeUserSearchScreenState extends State<KulubeUserSearchScreen> {
  bool shouldPop = false;
  bool didRequestDone = false;
  UserInfo? hoveringUser;
  final FocusNode _focusNode = FocusNode();

  Future<void> getRecomendedUsersRequestAsync(Function callback) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    await store.dispatch(getRecomendedUsersRequestAction(false));
    if (mounted) {
      callback();
    }
  }

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_onFocusChanged);

    getRecomendedUsersRequestAsync(() {
      setState(() {
        didRequestDone = true;
      });
    });
  }

  void _onFocusChanged() {
    if (!_focusNode.hasFocus) {
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

    // ⚡️ Animasyon bitene kadar bekle
    await Future.delayed(Duration.zero);

    await store.dispatch(setSelectedUserAction(user));
  }


  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = StoreProvider.of<AppState>(context);

   if (shouldPop) {
      store.dispatch(resetUserSearchDataAction());
      setState(() {
        shouldPop = false;
      });

      if (hoveringUser != null && widget.isForUserProfile) {
        _updateSelectedUser(hoveringUser!);
      }
      // Hovering yoksa veya user profile değilse, sadece yukarıda setState çalışır. 
      // Pop işlemi _updateSelectedUser içinde yapılır.
    }

    return BenekBluredModalBarier(
      isDismissible: false,
      onDismiss: () async {
        Navigator.pop(context);
      },
      child: KeyboardListener(
        focusNode: _focusNode,
        onKeyEvent: (KeyEvent event) {
          if (event is KeyDownEvent &&
              event.logicalKey == LogicalKeyboardKey.escape) {
            setState(() {
              hoveringUser = null;
              shouldPop = true;
            });
          }
        },
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          backgroundColor: Colors.transparent,
          body: SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const UserSearchBarTextFieldWidget(),
                const SizedBox(height: 16.0),
                ((store.state.userSearchResultList != null &&
                            store.state.userSearchResultList!.users != null &&
                            store.state.userSearchResultList!.users!
                                .isNotEmpty) ||
                        (store.state.recomendedUsersList != null &&
                            store.state.recomendedUsersList!.users != null &&
                            store.state.recomendedUsersList!.users!
                                .isNotEmpty))
                    ? UserSearchResultList(
                        onUserTapCallback: _updateSelectedUser,
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
                      )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
