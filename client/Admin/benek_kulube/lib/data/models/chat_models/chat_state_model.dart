import 'chat_model.dart';

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

  void sortChats(){
    if( chats != null && chats!.length > 0 ){
      chats!.sort((a, b) => b!.messages!.last.sendDate!.compareTo(a!.messages!.last.sendDate!));
    }
  }

  void addMessageOrChat(ChatModel newChat){
    if( chats != null && chats!.length > 0 ){
      ChatModel? chatOfTheMessage = chats?.firstWhere(
              (element) =>
                  element!.id == newChat.id,
                  orElse: () => null
      );

      if( chatOfTheMessage != null ) {
        for (var message in newChat.messages!) {
          chatOfTheMessage.addMessage(message);
        }
        chatOfTheMessage.members = newChat.members;

        chatOfTheMessage.sortMessages();
      }else{
        chats!.add(newChat);
      }

      sortChats();
    }else{
      chats = [newChat];
    }
  }
}