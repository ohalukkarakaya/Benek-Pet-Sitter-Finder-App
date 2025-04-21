import 'dart:developer';

import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_home_tab/home_screen_home_tab.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/home_screen_profile_tab.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_right_tabs/home_screen_home_right_bar/home_screen_logs_right_bar.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_bar/user_search_bar_buton.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../common/constants/tabs_enum.dart';
import '../loading_components/benek_loading_component.dart';
import 'home_screen_tabs/home_screen_employees_tab/home_screen_employees_tab.dart';
import 'home_screen_tabs/home_screen_logs_tab/home_screen_logs_tab.dart';
import 'home_screen_tabs/home_screen_payment_data_tab/home_screen_payment_data_tab.dart';
import 'home_screen_tabs/home_screen_report_tab/home_screen_report_right_tab.dart';
import 'home_screen_tabs/home_screen_report_tab/home_screen_report_tab.dart';
import 'home_screen_tabs/home_screen_right_tabs/home_screen_home_right_bar/home_screen_home_right_bar.dart';
import 'home_screen_tabs/home_screen_right_tabs/home_screen_home_right_bar/home_screen_profile_right_tab.dart';
import 'home_screen_tabs_bar_companents/home_screen_tabs_bar.dart';

class HomeScreenGrid extends StatelessWidget {
  final Store<AppState> store;
  const HomeScreenGrid({
    super.key,
    required this.store
  });

  @override
  Widget build(BuildContext context) {
    if (store.state.isLoading) {
      return Row(
        children: [
          HomeScreenTabsBar(store: store),
          Expanded(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: BenekLoadingComponent(),
              ),
            ),
          ),
        ],
      );
    }

    final isLogsTab = store.state.activeTab == AppTabsEnums.LOGS_TAB;

    final noUserSelected = store.state.selectedUserInfo == null;

    return Row(
      children: [
        // Sol bar
        HomeScreenTabsBar(store: store),

        // Eğer Logs tab ise → sağ + orta, tek widget olacak
        if (isLogsTab && noUserSelected)
          Expanded(
            child: KulubeLogsTabWidget(), // bu hem ortayı hem sağ tarafı kaplayacak
          )
        else
          ...[
            // Orta alan
            Expanded(
              child: Column(
                children: [
                  Expanded(
                    child: SizedBox(
                      width: store.state.activeTab == AppTabsEnums.PAYMENT_TAB
                        ? 600
                        : 600,
                      child: ScrollConfiguration(
                        behavior: ScrollConfiguration.of(context).copyWith(
                          scrollbars: false,
                          overscroll: false,
                          physics: const BouncingScrollPhysics(),
                        ),
                        child: ListView(
                          shrinkWrap: true,
                          physics: store.state.selectedUserInfo == null
                          && store.state.activeTab != AppTabsEnums.PAYMENT_TAB
                              ? const NeverScrollableScrollPhysics()
                              : const BouncingScrollPhysics(),
                          children: [
                            const KulubeSearchBarButon(),
                            SizedBox(
                                height: store.state.activeTab == AppTabsEnums.REPORTED_TAB
                                          ? 0
                                          : 100
                            ),
                            store.state.selectedUserInfo == null
                                ? store.state.activeTab == AppTabsEnums.HOME_TAB
                                    ? KulubeHomeTabWidget(
                                      firstName: store.state.userInfo!.identity!.firstName!,
                                      middleName: store.state.userInfo!.identity!.middleName,
                                      lastName: store.state.userInfo!.identity!.lastName!,
                                    )
                                    : store.state.activeTab == AppTabsEnums.REPORTED_TAB
                                        ? KulubeReportTabWidget()
                                        : store.state.activeTab == AppTabsEnums.PAYMENT_TAB
                                            ? HomeScreenPaymentDataTab()
                                            : store.state.activeTab == AppTabsEnums.EMPLOYEES_TAB
                                                ? HomeScreenEmployeesTab()
                                                : const SizedBox()
                                : const ProfileTab()
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Sağ bar
            store.state.selectedUserInfo == null
                ? store.state.activeTab == AppTabsEnums.HOME_TAB
                  || store.state.activeTab == AppTabsEnums.PAYMENT_TAB
                    || store.state.activeTab == AppTabsEnums.EMPLOYEES_TAB
                    ? HomeScreenHomeRightTab(user: store.state.userInfo!)
                    : store.state.activeTab == AppTabsEnums.REPORTED_TAB
                        ? HomeScreenReportRightTab(user: store.state.userInfo!)
                        : const SizedBox()
                : const HomeScreenProfileRightTab(),
          ]
      ],
    );
  }

}