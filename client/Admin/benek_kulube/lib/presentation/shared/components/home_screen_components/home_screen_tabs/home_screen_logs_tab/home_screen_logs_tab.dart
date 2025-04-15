import 'package:benek_kulube/redux/logs/get_logs_by_user_id/get_logs_by_user_id.action.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/app_redux_store.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../../data/models/log_models/log_model.dart';
import '../../../../../../redux/process_counter/process_counter.action.dart';
import '../../../../../features/user_profile_helpers/auth_role_helper.dart';
import '../../../benek_circle_avatar/benek_circle_avatar.dart';
import '../../../user_search_companents/user_search_bar/user_search_bar_buton.dart';
import '../home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_component.dart';

class KulubeLogsTabWidget extends StatefulWidget {
  const KulubeLogsTabWidget({super.key});

  @override
  State<KulubeLogsTabWidget> createState() => _KulubeLogsTabWidgetState();
}

class _KulubeLogsTabWidgetState extends State<KulubeLogsTabWidget> {

  bool isLogsLoading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      
      Store<AppState> store = StoreProvider.of<AppState>(context);
      final hasAccess = AuthRoleHelper.checkIfRequiredRole(
        store.state.userRoleId,
        [
          AuthRoleHelper.getAuthRoleIdFromRoleName('superAdmin'),
          AuthRoleHelper.getAuthRoleIdFromRoleName('developer'),
        ],
      );

      if(hasAccess){
        await store.dispatch(IncreaseProcessCounterAction());
        await store.dispatch(getLast30DaysLogsRequestAction());
        await store.dispatch(DecreaseProcessCounterAction());
        setState(() {
          isLogsLoading = false;
        });
      }
    });
  }

  @override
  void dispose() {
    Store<AppState> store = AppReduxStore.currentStore!;
    store.dispatch(resetLogs());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, List<LogModel>?>(
      converter: (store) => store.state.logs,
      builder: (context, logs) {
        final store = StoreProvider.of<AppState>(context);

        final hasAccess = AuthRoleHelper.checkIfRequiredRole(
          store.state.userRoleId,
          [
            AuthRoleHelper.getAuthRoleIdFromRoleName('superAdmin'),
            AuthRoleHelper.getAuthRoleIdFromRoleName('developer'),
          ],
        );

        if (!hasAccess) return const SizedBox();

        final size = MediaQuery.of(context).size;

        return Column(
          children: [
            // ÜST: Arama barı + Profil foto
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40.0, vertical: 45.0),
              child: IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start, // üst hizalama
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const KulubeSearchBarButon( shouldGivePaddingToTop: false ),
                    Padding(
                      padding: const EdgeInsets.only( top: 5.0),
                      child: BenekCircleAvatar(
                        width: 50,
                        height: 50,
                        radius: 100,
                        isDefaultAvatar: store.state.userInfo!.profileImg!.isDefaultImg!,
                        imageUrl: store.state.userInfo!.profileImg!.imgUrl!,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ALT: Log component
            Center(
              child: Padding(
                padding: const EdgeInsets.only(left: 30.0),
                child: UserIdLogPreviewComponent(
                  isLoading: isLogsLoading,
                  logData: logs,
                  width: size.width - 80, // sidebar padding düşüldü
                  height: 620,
                  shouldGivePaddingToBottom: false,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

