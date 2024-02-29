import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

// ignore: unnecessary_import
import 'package:flutter/rendering.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    return Container(
      child: Text(
        " ${BenekStringHelpers.getUsersFullName(
            store.state.selectedUserInfo!.identity!.firstName!,
            store.state.selectedUserInfo!.identity!.lastName!,
            store.state.selectedUserInfo!.identity!.middleName
          )}",
        style: const TextStyle(
          fontFamily: 'Qanelas',
          fontSize: 15.0,
          fontWeight: FontWeight.w400
        ),
      ),
    );
  }
}