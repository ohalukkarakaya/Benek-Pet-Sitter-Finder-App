import 'dart:developer';

import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_employees_tab/employee_card_shimmer_place_holder.dart';
import 'package:flutter/material.dart';

import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../../data/models/user_profile_models/user_list_model.dart';
import '../../../loading_components/benek_loading_component.dart';
import 'employees_result_list_custom_scroll_view_widget.dart';

class HomeScreenEmployeesTab extends StatefulWidget {
  const HomeScreenEmployeesTab({super.key});

  @override
  State<HomeScreenEmployeesTab> createState() => _HomeScreenEmployeesTabState();
}

class _HomeScreenEmployeesTabState extends State<HomeScreenEmployeesTab> {
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = AppReduxStore.currentStore!;
      await store.dispatch(getEmployeesAction(false));
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    });
  }

  @override
  void dispose() {
    super.dispose();
    Store<AppState> store = AppReduxStore.currentStore!;
    store.dispatch(resetEmployeesAction());
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return SizedBox(
        height: MediaQuery.of(context).size.height - 200,
        width: double.infinity,
        child: ListView.builder(
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 15,
          itemBuilder: (context, index) {
            return const EmployeeCardShimmerPlaceholder();
          },
        ),
      );
    }

    return StoreConnector<AppState, UserList?>(
      converter: (store) => store.state.employees,
      builder: (context, employees) {
        if (employees == null || employees.users == null || employees.users!.isEmpty) {
          return const Center(child: Text("No employees found."));
        }

        return Padding(
          padding: const EdgeInsets.only( bottom: 10.0),
          child: SizedBox(
            height: MediaQuery.of(context).size.height - 200,
            width: double.infinity,
            child: EmployeesResultListCustomScrollViewWidget(
              resultData: employees.users,
            ),
          ),
        );
      },
    );
  }

}
