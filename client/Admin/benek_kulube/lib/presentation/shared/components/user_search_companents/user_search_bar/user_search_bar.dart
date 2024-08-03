import 'dart:async';
import 'dart:developer';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:benek_kulube/store/app_state.dart';
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

  @override
  void initState() {
    super.initState();
  }

  void _startTimer() {
    if (_timer != null) {
      _timer!.cancel();
      if( textToSendServer.length < 2){
        store.dispatch(resetUserSearchDataAction());
      }

    }
    _timer = Timer( const Duration(seconds: 1), () {
      _isTextChanged = false;

      if (!_isTextChanged) {
        if (textToSendServer != '' && textToSendServer != " " && textToSendServer.length > 1){
          store.dispatch(userSearchRequestAction(BenekStringHelpers.trimSpaces(textToSendServer), false));
          // store.dispatch(getAnalyzeForSecondsAction(analyzeText));
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
    return Expanded(
      flex: 1,
      child: Hero(
        tag: 'user_search_text_field',
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: TextField(
            autofocus: true,
            controller: _controller,
            onChanged: (String value) {
              if( value.trim() != "" && value.trim() != " "  ){
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
                padding: EdgeInsets.only(right: 25.0),
                child: Icon( BenekIcons.searchcircle ),
              ),
              hintStyle: thinTextWithoutColorStyle( textFontSize: 20.0 ),
              fillColor: AppColors.benekBlack.withOpacity(0.9),
              contentPadding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
              filled: true,
              hintText: BenekStringHelpers.locale('searchAUser'),
              enabledBorder: InputBorder.none,
              border: const OutlineInputBorder(
                borderRadius: BorderRadius.all( Radius.circular( 6.0 ) ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(6.0),
              ),
            ),
            style: regularTextWithoutColorStyle( textFontSize: 20.0 ),
          ),
        ),
      ),
    );
  }
}