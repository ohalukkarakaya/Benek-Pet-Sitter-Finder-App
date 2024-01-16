import 'package:flutter/material.dart';

import '../../../../../common/constants/benek_icons.dart';
import 'home_screen_tabs_bar_elements.dart';

class HomeScreenTabsBar extends StatelessWidget {
  const HomeScreenTabsBar({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        TabsButonElement(icon: BenekIcons.chart, title: 'Loglar', onTapFunction: null),
      ],
    );
  }
}