import 'dart:developer';

import 'package:benek/data/models/chat_models/chat_member_model.dart';
import 'package:benek/data/models/chat_models/chat_state_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../../data/models/chat_models/chat_model.dart';
import '../../../data/models/chat_models/message_seen_data_model.dart';
import '../../../data/models/user_profile_models/user_info_model.dart';

ThunkAction<AppState> getUsersChatAsAdminRequestAction(String userId, String? lastItemId) {
  return (Store<AppState> store) async {
    ModerateUsersChatAsAdmin api = ModerateUsersChatAsAdmin();

    try {
      ChatStateModel? _chatData = await api.getUsersChatAsAdminRequest(userId, lastItemId);

      bool isPagination = lastItemId != null;
      if (isPagination) {
        for (var chat in _chatData!.chats!) {
          store.state.selectedUserInfo!.chatData?.addMessageOrChat(chat!, userId);
        }

        // ✅ Mevcut chatData'yı yeniden sırala
        store.state.selectedUserInfo!.chatData?.sortChats();

        _chatData = store.state.selectedUserInfo!.chatData;
      } else {
        // İlk çağrıysa sıralama zaten yapılmıştı
        _chatData?.sortChats();
      }

      await store.dispatch(GetUsersChatAsAdminRequestAction(_chatData));
    } on ApiException catch (e) {
      log('ERROR: getUsersChatAsAdminRequestAction - $e');
    }
  };
}

ThunkAction<AppState> getUsersChatAsAdminRequestActionFromSocket( ChatModel receivingChatData, String userId ) {
  return (Store<AppState> store) async {
    try {
      ModerateUsersChatAsAdmin api = ModerateUsersChatAsAdmin();
      int unReadMessageCountRes = await api.getUnreadMessagesFromChatId( receivingChatData.id!, userId );
      receivingChatData.unreadMessageCount = unReadMessageCountRes;

      ChatStateModel? chat = store.state.selectedUserInfo!.chatData;
      chat?.addMessageOrChat(receivingChatData, store.state.selectedUserInfo!.userId!);
      await store.dispatch(GetUsersChatAsAdminRequestAction(chat));
    } on ApiException catch (e) {
      log('ERROR: getUsersChatAsAdminFromSocketAction - $e');
    }
  };
}

ThunkAction<AppState> userLeftActionFromSocket( Map<String, dynamic> data ) {
  return (Store<AppState> store) async {
    try {
      ChatStateModel? chatState = store.state.selectedUserInfo!.chatData;
      if( chatState == null ||chatState.chats == null || chatState.chats!.isEmpty ) return;

      if( data['leavedUserId'] == store.state.selectedUserInfo!.userId ){
        // if the user left the chat, remove the chat from the list
        chatState.chats!.removeWhere((chat) => chat!.id == data['chatId']);
        await store.dispatch(GetUsersChatAsAdminRequestAction(chatState));
        return;
      }

      final chat = chatState.chats!.firstWhere(
            (chat) => chat!.id == data['chatId'],
        orElse: () => ChatModel(),
      );

      if( chat == null || chat.members == null || chat.members!.isEmpty ) return;

      chat.members!.removeWhere((member) => member.userData?.userId == data['leavedUserId']);

      await store.dispatch(GetUsersChatAsAdminRequestAction(chatState));
    } on ApiException catch (e) {
      log('ERROR: userLeftActionFromSocket - $e');
    }
  };

}

ThunkAction<AppState> searchChatAsAdminRequest( String userId, String searchText ) {
  return (Store<AppState> store) async {
    try {
      ModerateUsersChatAsAdmin api = ModerateUsersChatAsAdmin();
      ChatStateModel? _searchedChatResult = await api.getSearchChatAsAdminRequest( userId, searchText );
      _searchedChatResult?.sortChats();

      await store.dispatch(SearchUsersChatAsAdminRequestAction(_searchedChatResult));
    } on ApiException catch (e) {
      log('ERROR: searchChatAsAdminRequest - $e');
    }
  };
}

ThunkAction<AppState> resetChatAsAdminRequest() {
  return (Store<AppState> store) async {
    try {
      ChatStateModel? _reset = null;

      await store.dispatch(SearchUsersChatAsAdminRequestAction(_reset));
    } on ApiException catch (e) {
      log('ERROR: searchChatAsAdminRequest - $e');
    }
  };
}

ThunkAction<AppState> seenMessageAsAdminBySocketAction( MessageSeenData receivingSeenData ) {
  return (Store<AppState> store) async {
    try {
      ChatStateModel? chats = store.state.selectedUserInfo!.chatData;
      chats?.seeMessage(receivingSeenData);

      await store.dispatch(GetUsersChatAsAdminRequestAction(chats));
    } on ApiException catch (e) {
      log('ERROR: seenMessageAsAdminBySocketAction - $e');
    }
  };
}

ThunkAction<AppState> seeMessagesAction( String chatId, List<String> messageIds ) {
  return (Store<AppState> store) async {
    try {
      ModerateUsersChatAsAdmin api = ModerateUsersChatAsAdmin();
      bool response = await api.seeMessages( chatId, messageIds );

      if( !response ){
        log('ERROR: seeMessagesAction - response is false');
      }
    } on ApiException catch (e) {
      log('ERROR: seeMessagesAction - $e');
    }
  };
}

ThunkAction<AppState> createChat( String desc, List<String> memberIds ) {
  return (Store<AppState> store) async {
    try {
      ModerateUsersChatAsAdmin api = ModerateUsersChatAsAdmin();
      String? newChatId = await api.postCreateChatRequest( desc, memberIds );

      return newChatId;
    } on ApiException catch (e) {
      log('ERROR: createChat - $e');
    }
  };
}

ThunkAction<AppState> addMembersToChat( String chatId, List<UserInfo> memberList ) {
  return (Store<AppState> store) async {
    try {
      ModerateUsersChatAsAdmin api = ModerateUsersChatAsAdmin();

      List<String> memberIds = memberList.map((e) => e.userId!).toList();
      String? newChatId = await api.postAddMemberToChatRequest( chatId, memberIds );

      List<ChatMemberModel> newMembers = memberList.map((e) => ChatMemberModel.fromUserInfo(e)).toList();

      ChatStateModel? chat = store.state.selectedUserInfo!.chatData;
      chat?.addMembersToChat(chatId, newMembers);

      await store.dispatch(GetUsersChatAsAdminRequestAction(chat));
    } on ApiException catch (e) {
      log('ERROR: addMembersToChat - $e');
    }
  };
}

ThunkAction<AppState> leaveChatAction( String chatId ) {
  return (Store<AppState> store) async {
    try {
      ModerateUsersChatAsAdmin api = ModerateUsersChatAsAdmin();

      String? newChatId = await api.deleteLeaveChatRequest( chatId );

      ChatStateModel? chat = store.state.selectedUserInfo!.chatData;
      chat?.leaveChat(chatId);

      await store.dispatch(GetUsersChatAsAdminRequestAction(chat));
    } on ApiException catch (e) {
      log('ERROR: leaveChatAction - $e');
    }
  };
}

class GetUsersChatAsAdminRequestAction {
  final ChatStateModel? _chatData;
  ChatStateModel? get chatData => _chatData;
  GetUsersChatAsAdminRequestAction(this._chatData);
}

class SearchUsersChatAsAdminRequestAction {
  final ChatStateModel? _searchedChatResult;
  ChatStateModel? get searchedChatResult => _searchedChatResult;
  SearchUsersChatAsAdminRequestAction(this._searchedChatResult);
}