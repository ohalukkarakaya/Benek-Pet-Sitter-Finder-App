import 'dart:async';
import 'dart:developer';

import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_redux_store.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter/material.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class UserSearchBarTextFieldWidget extends StatefulWidget {
  const UserSearchBarTextFieldWidget({super.key});

  @override
  State<UserSearchBarTextFieldWidget> createState() => _UserSearchBarTextFieldWidgetState();
}

class _UserSearchBarTextFieldWidgetState extends State<UserSearchBarTextFieldWidget> {
  Store<AppState> store = AppReduxStore.currentStore!;
  final TextEditingController _controller = TextEditingController();

  Timer? _timer;
  bool _isTextChanged = false;
  String textToSendServer = '';

  void _startTimer() {
    if (_timer != null) {
      _timer!.cancel();
      if (textToSendServer.length < 2) {
        store.dispatch(resetUserSearchDataAction());
      }
    }
    _timer = Timer(const Duration(seconds: 1), () {
      _isTextChanged = false;

      if (!_isTextChanged) {
        if (textToSendServer != '' && textToSendServer != " " && textToSendServer.length > 1) {
          store.dispatch(userSearchRequestAction(BenekStringHelpers.trimSpaces(textToSendServer), false));
          log('The Value: ${BenekStringHelpers.trimSpaces(textToSendServer)} Searched...');
          setState(() {
            textToSendServer = '';
          });
        } else {
          store.dispatch(resetUserSearchDataAction());
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    store.dispatch(resetUserSearchDataAction());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double dynamicFontSize = screenWidth < 400 ? 16.0 : 20.0;
    double dynamicPadding = screenWidth < 400 ? 15.0 : 20.0;

    return Expanded(
      flex: 1,
      child: Hero(
        tag: 'user_search_text_field',
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          backgroundColor: Colors.transparent,
          body: Padding(
            padding:  EdgeInsets.only(
              left: MediaQuery.of(context).size.width > 800 ? 250.0 : 20.0,
              right: MediaQuery.of(context).size.width > 800 ? 250.0 : 20.0,
            ),
            child: TextField(
              autofocus: true,
              controller: _controller,
              onChanged: (String value) {
                if (value.trim() != "" && value.trim() != " ") {
                  setState(() {
                    _isTextChanged = true;
                    textToSendServer = value;
                  });
                  _startTimer();
                }
              },
              cursorColor: AppColors.benekLightBlue,
              decoration: InputDecoration(
                suffixIcon: const Padding(
                  padding: EdgeInsets.only(right: 20.0),
                  child: Icon(BenekIcons.searchcircle),
                ),
                hintStyle: thinTextWithoutColorStyle(textFontSize: dynamicFontSize),
                fillColor: AppColors.benekBlack.withAlpha(230),
                contentPadding: EdgeInsets.symmetric(horizontal: dynamicPadding, vertical: dynamicPadding),
                filled: true,
                hintText: BenekStringHelpers.locale('searchAUser'),
                enabledBorder: InputBorder.none,
                border: const OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(6.0)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(6.0),
                ),
              ),
              style: regularTextWithoutColorStyle(textFontSize: dynamicFontSize),
            ),
          ),
        ),
      ),
    );
  }
}
