import 'dart:developer';

import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../../data/models/chat_models/chat_model.dart';

import 'package:benek_kulube/store/actions/app_actions.dart';

ThunkAction<AppState> getMessagesAction( String userId, String chatId, String? lastItemId ) {
  return (Store<AppState> store) async {
    ModerateUsersMessagesAsAdmin api = ModerateUsersMessagesAsAdmin();

    try {
      ChatModel? messagesChatData = await api.getUsersMessagesAsAdminRequest( userId, chatId, lastItemId);
      messagesChatData?.sortMessages();
      messagesChatData?.id = chatId;

      store.state.selectedUserInfo!.chatData?.addMessageOrChat(messagesChatData!, userId);
      ChatStateModel? _chatData = store.state.selectedUserInfo!.chatData;

      await store.dispatch(GetUsersChatAsAdminRequestAction(_chatData));
    } on ApiException catch (e) {
      log('ERROR: getMessagesAction - $e');
    }
  };
}