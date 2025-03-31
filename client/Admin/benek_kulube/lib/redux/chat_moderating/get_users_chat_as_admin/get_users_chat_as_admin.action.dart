import 'dart:developer';

import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../../data/models/chat_models/chat_model.dart';
import '../../../data/models/chat_models/message_seen_data_model.dart';

ThunkAction<AppState> getUsersChatAsAdminRequestAction( String userId, String? lastItemId ) {
  return (Store<AppState> store) async {
    GetUsersChatAsAdmin api = GetUsersChatAsAdmin();

    try {
      ChatStateModel? _chatData = await api.getUsersChatAsAdminRequest( userId, lastItemId);
      _chatData?.sortChats();

      bool isPagination = lastItemId != null;
      if( isPagination ){
        for(var chat in _chatData!.chats!){
          store.state.selectedUserInfo!.chatData?.addMessageOrChat(chat!, userId);
        }

        _chatData = store.state.selectedUserInfo!.chatData;
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
      GetUsersChatAsAdmin api = GetUsersChatAsAdmin();
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

ThunkAction<AppState> searchChatAsAdminRequest( String userId, String searchText ) {
  return (Store<AppState> store) async {
    try {
      GetUsersChatAsAdmin api = GetUsersChatAsAdmin();
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