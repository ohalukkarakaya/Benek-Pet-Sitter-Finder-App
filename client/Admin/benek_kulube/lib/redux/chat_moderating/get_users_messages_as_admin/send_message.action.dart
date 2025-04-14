import 'dart:developer';

import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../../common/constants/message_type_enum.dart';
import '../../../data/models/chat_models/chat_model.dart';

import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../../data/models/chat_models/message_model.dart';

ThunkAction<AppState> sendMessageAction( String chatId, String message ) {
  return (Store<AppState> store) async {
    ModerateUsersMessagesAsAdmin api = ModerateUsersMessagesAsAdmin();

    try {
      String? sendedMessageId = await api.postSendMessage( chatId, message );
      if( sendedMessageId == null ) return;

      MessageModel? sendedMessage = MessageModel(
        sendedUserId: store.state.userInfo!.userId,
        sendedUser: store.state.userInfo,
        messageType: MessageTypeEnum.TEXT,
        message: message,
        seenBy: [],
        sendDate: DateTime.now(),
        id: sendedMessageId
      );

      ChatModel selectedChat = store.state.selectedUserInfo!.chatData!.getChatById(chatId)!;
      selectedChat.addMessage(sendedMessage);

      ChatStateModel? _chatData = store.state.selectedUserInfo!.chatData;

      await store.dispatch(GetUsersChatAsAdminRequestAction(_chatData));
    } on ApiException catch (e) {
      log('ERROR: sendMessageAction - $e');
    }
  };
}