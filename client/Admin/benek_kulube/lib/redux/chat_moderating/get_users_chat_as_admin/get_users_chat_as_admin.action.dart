import 'dart:developer';

import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../../data/models/chat_models/chat_model.dart';

ThunkAction<AppState> getUsersChatAsAdminRequestAction( String userId, String? lastItemId ) {
  return (Store<AppState> store) async {
    GetUsersChatAsAdmin api = GetUsersChatAsAdmin();

    try {
      ChatStateModel? _chatData = await api.getUsersChatAsAdminRequest( userId, lastItemId);

      await store.dispatch(GetUsersChatAsAdminRequestAction(_chatData));
    } on ApiException catch (e) {
      log('ERROR: getUsersChatAsAdminRequestAction - $e');
    }
  };
}

ThunkAction<AppState> getUsersChatAsAdminRequestActionFromSocket( ChatModel receivingChatData ) {
  return (Store<AppState> store) async {
    try {
      ChatStateModel? chat = store.state.selectedUserInfo!.chatData;
      chat?.addMessageOrChat(receivingChatData);
      await store.dispatch(GetUsersChatAsAdminRequestAction(chat));
    } on ApiException catch (e) {
      log('ERROR: getUsersChatAsAdminFromSocketAction - $e');
    }
  };
}

class GetUsersChatAsAdminRequestAction {
  final ChatStateModel? _chatData;
  ChatStateModel? get chatData => _chatData;
  GetUsersChatAsAdminRequestAction(this._chatData);
}