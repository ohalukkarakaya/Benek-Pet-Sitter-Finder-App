import 'package:intl/intl.dart';

import 'chat_member_model.dart';
import 'message_model.dart';

class ChatModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  List<ChatMemberModel>? members;
  DateTime? chatStartDate;
  String? chatDesc;
  List<MessageModel>? messages;
  String? chatImageUrl;
  String? chatName;

  ChatModel(
      {
        this.id,
        this.members,
        this.chatStartDate,
        this.chatDesc,
        this.messages,
        this.chatImageUrl,
        this.chatName
      }
  );

  ChatModel.fromJson(Map<String, dynamic> json) {
    id = json['_id'];
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
    }else{
      messages = <MessageModel>[];
    };
    chatImageUrl = json['chatImageUrl'];
    chatName = json['chatName'];
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
    return data;
  }

  void addMessage(MessageModel newMessage){
    messages ??= <MessageModel>[];
    messages!.add(newMessage);
  }

  void sortMessages(){
    messages?.sort((a, b) => a.sendDate!.compareTo(b.sendDate!));
  }
}