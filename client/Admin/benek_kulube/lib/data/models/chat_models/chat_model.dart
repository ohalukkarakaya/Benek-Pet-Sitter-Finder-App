import 'package:intl/intl.dart';

import 'chat_member_model.dart';
import 'message_model.dart';
import 'message_seen_data_model.dart';

class ChatModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  List<ChatMemberModel>? members;
  DateTime? chatStartDate;
  String? chatDesc;
  List<MessageModel>? messages;
  String? chatImageUrl;
  String? chatName;
  int? unreadMessageCount;
  int? totalMessageCount;

  ChatModel(
      {
        this.id,
        this.members,
        this.chatStartDate,
        this.chatDesc,
        this.messages,
        this.chatImageUrl,
        this.chatName,
        this.unreadMessageCount,
        this.totalMessageCount
      }
  );

  ChatModel.fromJson(Map<String, dynamic> json) {
    id = json['_id'] ?? json['id'];
    if (json['members'] != null) {
      members = <ChatMemberModel>[];
      json['members'].forEach((v) {
        members!.add(ChatMemberModel.fromJson(v));
      });
    }
    chatStartDate = format.parse(json['chatStartDate']);
    chatDesc = json['chatDesc'];
    if( json['messages'] != null && json['messages'].length > 0 ){
      messages = <MessageModel>[];
      json['messages'].forEach((v) {
        messages!.add(MessageModel.fromJson(v));
      });
    }else if( json['lastMessage'] != null ){
      messages = [ MessageModel.fromJson(json['lastMessage']) ];
    }else if( json['message'] != null ){
      messages = [ MessageModel.fromJson(json['message']) ];
    }else{
      messages = <MessageModel>[];
    };
    chatImageUrl = json['chatImageUrl'];
    chatName = json['chatName'];
    unreadMessageCount = json['unreadMessageCount'] ?? 0;
    totalMessageCount = json['totalMessageCount'] ?? 0;
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = id;
    if (members != null) {
      data['members'] = members!.map((v) => v.toJson()).toList();
    }
    data['chatStartDate'] = chatStartDate;
    data['chatDesc'] = chatDesc;
    if (messages != null) {
      data['lastMessage'] = messages!.map((v) => v.toJson()).toList();
    }
    data['chatImageUrl'] = chatImageUrl;
    data['chatName'] = chatName;
    data['unreadMessageCount'] = unreadMessageCount;
    data['totalMessageCount'] = totalMessageCount;
    return data;
  }

  void addMessage( MessageModel newMessage ){
    messages ??= <MessageModel>[];

    if (!messages!.any((m) => m.id == newMessage.id)) {
      messages!.add(newMessage);
    }
  }

  void addMessagesList(List<MessageModel> newMessages ){
    messages ??= <MessageModel>[];

    for (var message in newMessages) {
      if (!messages!.any((m) => m.id == message.id)) {
        messages!.add(message);
      }
    }

    // make all messages unique
    messages = messages!.toSet().toList();

    sortMessages();
  }

  void seeMessage(MessageSeenData messageSeenData){
    if( messages != null ){
      for( var messageId in messageSeenData.messageIdsList! ){
        for (var message in messages??[]) {
          if( message.id == messageId ){

            message.seenBy ??= <String>[];

            if( !message.seenBy?.contains(messageSeenData.userId) ){
              message.seenBy!.add(messageSeenData.userId!);
            }
          }
        }
      }

      if(messageSeenData.chatOwnerId == messageSeenData.userId) {
        unreadMessageCount = unreadMessageCount != null
        && unreadMessageCount! > 0
        && unreadMessageCount! >= messageSeenData.messageIdsList!.length
           ? unreadMessageCount! - messageSeenData.messageIdsList!.length
           : 0;
      }
    }
  }

  void sortMessages(){
    messages?.sort((a, b) => b.sendDate!.compareTo(a.sendDate!));
  }
}