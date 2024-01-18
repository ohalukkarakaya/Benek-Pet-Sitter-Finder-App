import 'package:benek_kulube/presentation/features/counter/components/counter_widget.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:redux/redux.dart';

import 'home_screen_tabs_bar_companents/home_screen_tabs_bar.dart';

class HomeScreenGrid extends StatelessWidget {
  final Store<AppState> store;
  const HomeScreenGrid({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          HomeScreenTabsBar( store: store,),
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 100.0),
                child: Container(
                  height: 45,
                  width: 500,
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.all( Radius.circular( 5.0 ) ),
                    color: Colors.black.withOpacity(0.2),
                  ),
                ),
              ),
              const SizedBox( height: 100,),
              Center(child: CounterWidget()),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 40.0),
                child: Container(
                  decoration: const BoxDecoration(
                    borderRadius: BorderRadius.all( Radius.circular( 100.0 ) ),
                    color: Colors.white,
                  ),
                  height: 40,
                  width: 40,
                ),
              ),
              Image.asset(
                'assets/images/saluting_dog.png',
                width: 350,
              ),
            ],
          ),
        ],
      );
  }
}