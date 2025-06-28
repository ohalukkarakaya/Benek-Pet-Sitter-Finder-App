import 'package:benek/store/app_state.dart';
import 'package:benek/presentation/shared/components/user_search_companents/user_search_bar/user_search_bar_buton.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, AppState>(
      converter: (Store<AppState> store) => store.state,
      builder: (context, state) {
        return const Scaffold(
          backgroundColor: Colors.transparent,
          body: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ✅ Mobil uyumlu konumda buton
                KulubeSearchBarButon(
                  shouldGivePaddingToTop: false,
                ),
                SizedBox(height: 20),
                // Diğer mobil içeriklerin buraya eklenebilir
              ],
            ),
          ),
        );
      },
    );
  }
}
