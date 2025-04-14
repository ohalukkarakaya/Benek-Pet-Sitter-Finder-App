import 'package:benek_kulube/data/models/chat_models/chat_member_model.dart';
import 'package:benek_kulube/data/models/chat_models/message_model.dart';

import 'chat_model.dart';
import 'message_seen_data_model.dart';

import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:benek_kulube/store/app_state.dart';

class ChatStateModel {
  int? totalChatCount;
  List<ChatModel?>? chats;

  ChatStateModel({this.totalChatCount, this.chats});

  ChatStateModel.fromJson(Map<String, dynamic> json) {
    json['totalChatCount'] != null
        ? totalChatCount = json['totalChatCount']
        : json['chats'].length;
    if (json['chats'] != null) {
      chats = <ChatModel>[];
      json['chats'].forEach((v) {
        chats!.add(ChatModel.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = Map<String, dynamic>();
    data['totalChatCount'] = totalChatCount;
    if (chats != null) {
      data['chats'] = chats!.map((v) => v!.toJson()).toList();
    }
    return data;
  }

  void sortChats() {
    if (chats == null || chats!.isEmpty) return;

    chats!.sort((a, b) {
      final aDate = _getLastActivityDate(a);
      final bDate = _getLastActivityDate(b);

      return bDate.compareTo(aDate);
    });
  }

  DateTime _getLastActivityDate(ChatModel? chat) {
    if (chat?.messages != null && chat!.messages!.isNotEmpty) {
      // Mesajların hepsine bak, en son tarihli olanı al
      final validDates = chat.messages!
          .where((m) => m.sendDate != null)
          .map((m) => m.sendDate!)
          .toList();

      if (validDates.isNotEmpty) {
        validDates.sort((a, b) => b.compareTo(a)); // Desc
        return validDates.first;
      }
    }

    if (chat?.chatStartDate != null) {
      return chat!.chatStartDate!;
    }

    return DateTime.fromMillisecondsSinceEpoch(0);
  }

  ChatModel? getChatById(String chatId) {
    return chats!.firstWhere(
          (element) => element!.id.toString() == chatId,
      orElse: () => null as ChatModel,
    );
  }

  void addMessageOrChat(ChatModel newChat, String userId) {
    Store<AppState> store = AppReduxStore.currentStore!;
    if (store.state.userInfo!.userId == store.state.selectedUserInfo!.userId) {
      List<String> messagesIdsList = [];
      for (MessageModel message in newChat.messages!) {
        if (message.seenBy != null && message.seenBy!.contains(userId)) {
          continue;
        }
        messagesIdsList.add(message.id!);
        message.seenBy != null
            ? message.seenBy!.add(userId)
            : message.seenBy = [userId];
      }

      if (messagesIdsList.isNotEmpty) {
        store.dispatch(seeMessagesAction(newChat.id!, messagesIdsList));
      }
    }

    if (chats != null && chats!.isNotEmpty) {
      int existingIndex = chats!.indexWhere((element) => element!.id.toString() == newChat.id.toString());

      if (existingIndex != -1) {
        ChatModel chatOfTheMessage = chats![existingIndex]!;

        chatOfTheMessage.unreadMessageCount = newChat.unreadMessageCount;

        for (var message in newChat.messages!) {
          chatOfTheMessage.addMessage(message);
        }

        if (newChat.members != null && newChat.members!.isNotEmpty) {
          chatOfTheMessage.members = newChat.members;
        }

        chatOfTheMessage.totalMessageCount = newChat.totalMessageCount;
        chatOfTheMessage.sortMessages();

        chats![existingIndex] = chatOfTheMessage;
      } else {
        chats!.add(newChat);
      }
    } else {
      chats = [newChat];
    }

    sortChats();
  }

  void seeMessage(MessageSeenData receivingSeenData){
    for( var chat in chats??[] ){
      if( chat.id == receivingSeenData.chatId ){
        chat.seeMessage(receivingSeenData);
      }
    }
  }

  void addMembersToChat( String chatId, List<ChatMemberModel> newMembers ){
    for( var chat in chats??[] ){
      if( chat.id == chatId ){
        chat.members.addAll(newMembers);
      }
    }
  }

  void leaveChat( String chatId ){
    chats = chats?.where((chat) => chat!.id != chatId).toList();
  }
}