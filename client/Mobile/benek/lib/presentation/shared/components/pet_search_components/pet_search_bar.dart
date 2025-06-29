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

class PetSearchBarTextFieldWidget extends StatefulWidget {
  const PetSearchBarTextFieldWidget({super.key});

  @override
  State<PetSearchBarTextFieldWidget> createState() => _PetSearchBarTextFieldWidgetState();
}

class _PetSearchBarTextFieldWidgetState extends State<PetSearchBarTextFieldWidget> {
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
        store.dispatch(resetPetSearchDataAction());
      }

    }
    _timer = Timer( const Duration(seconds: 1), () {
      _isTextChanged = false;

      if (!_isTextChanged) {
        if (textToSendServer != '' && textToSendServer != " " && textToSendServer.length > 1){
          store.dispatch(petSearchRequestAction(BenekStringHelpers.trimSpaces(textToSendServer), false));
          log('The Value: ${BenekStringHelpers.trimSpaces(textToSendServer)} Searched In Pets...');
          setState(() {
            textToSendServer = '';
          });
        } else {
          store.dispatch(resetPetSearchDataAction());
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    store.dispatch(resetPetSearchDataAction());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: 1,
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
              hintText: BenekStringHelpers.locale('searchAPet'),
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
    );
  }
}