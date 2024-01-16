import 'package:benek_kulube/presentation/features/counter/components/counter_widget.dart';
import 'package:benek_kulube/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:flutter/material.dart';

import 'home_screen_tabs_bar_companents/home_screen_tabs_bar.dart';

class HomeScreenGrid extends StatelessWidget {
  const HomeScreenGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const HomeScreenTabsBar(),
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CounterWidget(),
              ],
            ),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                BenekProcessIndicator(
                  width: 100,
                  height: 100,
                ),
              ],
            ),
          ],
        ),
    );
  }
}