import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../components/home_screen_components/home_screen_grid.dart';

class HomeScreen extends StatelessWidget {
  final Store<AppState> store;
  const HomeScreen({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return HomeScreenGrid( store: store );
  }
}
