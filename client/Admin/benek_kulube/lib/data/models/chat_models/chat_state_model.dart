

import 'dart:developer';

import '../../services/api.dart';
import 'chat_model.dart';
import 'message_seen_data_model.dart';

class ChatStateModel {
  int? totalChatCount;
  List<ChatModel?>? chats;

  ChatStateModel({this.totalChatCount, this.chats});

  ChatStateModel.fromJson(Map<String, dynamic> json) {
    totalChatCount = json['totalChatCount'];
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

      return bDate.compareTo(aDate); // en yeni yukarıda
    });
  }

  DateTime _getLastActivityDate(ChatModel? chat) {
    // Eğer mesaj varsa ve geçerli tarih varsa onu kullan
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
}