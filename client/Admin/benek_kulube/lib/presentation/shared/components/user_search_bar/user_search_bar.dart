import 'dart:async';
import 'dart:developer';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:redux/redux.dart';

class UserSearchBarTextFieldWidget extends StatefulWidget {
  const UserSearchBarTextFieldWidget({super.key});

  @override
  State<UserSearchBarTextFieldWidget> createState() => _UserSearchBarTextFieldWidgetState();
}

class _UserSearchBarTextFieldWidgetState extends State<UserSearchBarTextFieldWidget> {
  Store<AppState> store = AppReduxStore.currentStore!;
  final TextEditingController _controller = TextEditingController();
  bool shouldPop = false;
  Timer? _timer;
  bool _isTextChanged = false;
  String textToSendServer = '';
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_onFocusChanged);
  }

  void _onFocusChanged(){
    if (!_focusNode.hasFocus){
       setState(() {
         shouldPop = true;
       });
    }
  }

  void _startTimer() {
    if (_timer != null) {
      _timer!.cancel();
      log('reset fonksiyonu (?) gerekirse');
    }
    _timer = Timer(Duration(seconds: 1), () {
      _isTextChanged = false;

      if (!_isTextChanged) {
        if (textToSendServer != '' && textToSendServer.length >= 10) {
          // store.dispatch(getAnalyzeForSecondsAction(analyzeText));
          log('Send Text to Server: $textToSendServer');
          setState(() {
            textToSendServer = '';
          });
        } else {
          // store.dispatch(resetAnalyzeForSecondsAction());
          log('reset fonksiyonu (?) gerekirse');
        }
      }
    });
  }

   @override
    void dispose() {
      _timer?.cancel();
      super.dispose();
    }

  @override
  Widget build(BuildContext context) {
    if( shouldPop ){
      setState(() {
        shouldPop = false;
      });

      Navigator.pop(context);
    }
    return Align(
      alignment: Alignment.topCenter,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: RawKeyboardListener(
          focusNode: FocusNode(),
          onKey: (RawKeyEvent event){
            if (event is RawKeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
                setState(() {
                  shouldPop = true;
                });
            }
          },
          child: TextField(
            enableSuggestions: false,
            autofocus: true,
            controller: _controller,
            focusNode: _focusNode,
            onChanged: (String value) {
              if(
                value.trim() != null
                && value.trim() != ""
                && value.trim() != " "
              ){
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
              hintStyle: const TextStyle(
                fontFamily: 'Qanelas',
                fontSize: 20.0,
                fontWeight: FontWeight.w200
              ),
              fillColor: AppColors.benekBlack.withOpacity(0.9),
              contentPadding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
              filled: true,
              hintText: 'Bir Kullanıcı Ara',
              enabledBorder: InputBorder.none,
              border: const OutlineInputBorder(
                borderRadius: BorderRadius.all( Radius.circular( 6.0 ) ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(6.0),
              ),
            ),
            style: const TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 20.0,
              fontWeight: FontWeight.w400
            )
          ),
        ),
      ),
    );
  }
}