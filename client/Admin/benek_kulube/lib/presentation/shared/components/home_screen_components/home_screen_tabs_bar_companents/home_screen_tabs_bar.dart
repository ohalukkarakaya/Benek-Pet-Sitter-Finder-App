import 'package:benek_kulube/common/constants/tabs_enum.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../common/constants/benek_icons.dart';
import 'home_screen_tabs_bar_elements.dart';

class HomeScreenTabsBar extends StatelessWidget {
  final Store<AppState> store;
  const HomeScreenTabsBar({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 20.0, bottom: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 20.0, top: 10.0),
            child: SvgPicture.asset(
              'assets/images/benek_logo.svg',
              width: 100,
            ),
          ),
          Column(
            children: [
              TabsButonElement(tab: AppTabsEnums.HOME_TAB, store: store, icon: BenekIcons.homebasic, title: 'Ana Menü'),
              const SizedBox( height: 50.0, ),
              TabsButonElement(tab: AppTabsEnums.LOGS_TAB, store: store, icon: BenekIcons.chart, title: 'Loglar'),
              const SizedBox( height: 10.0, ),
              TabsButonElement(tab: AppTabsEnums.REPORTED_TAB, store: store, icon: BenekIcons.flag, title: 'Bildirilenler'),
              const SizedBox( height: 10.0, ),
              TabsButonElement(tab: AppTabsEnums.FILES_TAB, store: store, icon: BenekIcons.file, title: 'Dosyalar'),
              const SizedBox( height: 10.0, ),
              TabsButonElement(tab: AppTabsEnums.EMPLOYEES_TAB, store: store, icon: BenekIcons.person, title: 'çalışanlar'),
              const SizedBox( height: 50.0, ),
              TabsButonElement(tab: AppTabsEnums.CONTACT_MESSAGES_TAB, store: store, icon: BenekIcons.dialogbox, title: 'Talepler'),
            ],
          ),
          TabsButonElement(tab: AppTabsEnums.LOGOUT_TAB, store: store, icon: BenekIcons.turnonbutonsquare, title: 'Çıkış Yap', shouldShowTextWhenDeActive: true),
        ],
      ),
    );
  }
}