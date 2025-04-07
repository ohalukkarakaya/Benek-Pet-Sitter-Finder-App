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
      final lastMessage = chat.messages!.last;
      if (lastMessage.sendDate != null) {
        return lastMessage.sendDate!;
      }
    }

    // Yoksa chatStartDate kullan
    if (chat?.chatStartDate != null) {
      return chat!.chatStartDate!;
    }

    // En son fallback: çok eski bir tarih
    return DateTime.fromMillisecondsSinceEpoch(0);
  }

  void addMessageOrChat(ChatModel newChat, String userId) {
    Store<AppState> store = AppReduxStore.currentStore!;
    if( userId == store.state.selectedUserInfo!.userId ){
      List<String> messagesIdsList = [];
      for( MessageModel message in newChat.messages! ){
        if(message.seenBy != null && message.seenBy!.contains(userId)){
          continue;
        }
        messagesIdsList.add(message.id!);
        message.seenBy != null
          ? message.seenBy!.add(userId)
          : message.seenBy = [userId];
      }

      if( messagesIdsList.isNotEmpty ){
        store.dispatch(seeMessagesAction(newChat.id!, messagesIdsList));
      }
    }

    if( chats != null && chats!.isNotEmpty ){
      ChatModel? chatOfTheMessage = chats?.firstWhere(
          (element) => element!.id.toString() == newChat.id.toString(),
          orElse: () => ChatModel());

      if( chatOfTheMessage != null && chatOfTheMessage.id != null ) {
        // Yeni mesajları ekle ve üyeleri güncelle
        chatOfTheMessage.unreadMessageCount = newChat.unreadMessageCount;
        for (var message in newChat.messages!) {
          chatOfTheMessage.addMessage(message, userId);
        }
        chatOfTheMessage.members = newChat.members;

        // Mesajları sırala
        chatOfTheMessage.sortMessages();

        // Var olan chat'i listeden çıkart ve en üste ekle
        chats!.removeWhere((element) => element!.id.toString() == newChat.id.toString());
        chats!.insert(0, chatOfTheMessage);
      }else{
        // Yeni chat ekle
        chats!.insert(0, newChat);
      }
    }else{
      // Eğer chats listesi boşsa, yeni chat'i ekle
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