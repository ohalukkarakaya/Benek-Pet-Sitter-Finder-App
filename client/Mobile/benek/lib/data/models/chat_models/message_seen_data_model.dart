class MessageSeenData {
  String? chatId;
  List<String>? messageIdsList;
  String? userId;
  String? chatOwnerId;

  MessageSeenData({
    this.chatId,
    this.messageIdsList,
    this.userId,
    this.chatOwnerId,
  });

  MessageSeenData.fromJson(Map<String, dynamic> json) {
    chatId = json['chatId'];
    if( json['messageIdsList'] != null){
      messageIdsList = <String>[];
      json['messageIdsList'].forEach((v) {
        messageIdsList!.add(v);
      });
    }
    userId = json['userId'];
    chatOwnerId = json['chatOwnerId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['chatId'] = chatId;
    data['messageIdsList'] = messageIdsList;
    data['userId'] = userId;
    data['chatOwnerId'] = chatOwnerId;
    return data;
  }
}