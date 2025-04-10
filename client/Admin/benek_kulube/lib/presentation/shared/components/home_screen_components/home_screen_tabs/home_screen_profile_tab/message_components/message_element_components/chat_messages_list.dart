import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../../../../../../../data/models/chat_models/chat_member_model.dart';
import '../../../../../../../../data/models/chat_models/chat_model.dart';
import '../../../../../../../../data/models/chat_models/message_model.dart';
import 'message_element.dart';

class ChatMessagesList extends StatefulWidget {
  final String chatBoxOwnerId;
  final ChatModel selectedChat;

  const ChatMessagesList({
    super.key,
    required this.chatBoxOwnerId,
    required this.selectedChat,
  });

  @override
  State<ChatMessagesList> createState() => _ChatMessagesListState();
}

class _ChatMessagesListState extends State<ChatMessagesList> {

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Liste açıldığında en alta kaydır
      //_scrollToBottom();
    });
  }

  @override
  void didUpdateWidget(covariant ChatMessagesList oldWidget) {
    super.didUpdateWidget(oldWidget);
  }

  @override
  Widget build(BuildContext context) {
    final originalMessages = widget.selectedChat.messages ?? [];

    if (originalMessages.isEmpty) {
      return const Center(child: Text('No messages'));
    }

    // 🔁 Sıralama: Eski mesaj üstte, yeni mesaj altta
    final messages = [...originalMessages]..sort((a, b) => b.sendDate!.compareTo(a.sendDate!));

    // Mesajları ardışık olarak gruplandır
    List<List<MessageModel>> groupedMessages = [];
    for (var message in messages) {
      if (groupedMessages.isEmpty ||
          groupedMessages.last.last.sendedUserId != message.sendedUserId) {
        groupedMessages.add([message]);
      } else {
        groupedMessages.last.add(message);
      }
    }

    // Widget listesi oluştur
    List<Widget> sliverMessages = [];

    ChatMemberModel? findMember(String sendedUserId) {
      try {
        return widget.selectedChat.members!
            .firstWhere((e) => e.userData?.userId == sendedUserId);
      } catch (e) {
        return null;
      }
    }

    for (var group in groupedMessages) {
      final sendedUserId = group[0].sendedUserId;
      final member = findMember(sendedUserId!);

      if (member == null) {
        debugPrint('❌ Member not found for sendedUserId: $sendedUserId');
        continue;
      }

      sliverMessages.add(
        MessageElement(
          chatBoxOwnerId: widget.chatBoxOwnerId,
          sendedUserProfileImage: member.userData!.profileImg!,
          messageList: group,
        ),
      );
    }

    return ScrollConfiguration(
      behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
      child: CustomScrollView(
        reverse: true,
        slivers: sliverMessages,
      ),
    );
  }
}