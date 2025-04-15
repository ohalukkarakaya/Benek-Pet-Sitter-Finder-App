import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
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
  final ScrollController _scrollController = ScrollController();
  bool isPaginating = false;

  @override
  void initState() {
    super.initState();

    _scrollController.addListener(_onScroll);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Liste açıldığında en alta kaydır
      // kullanıldığında normal scrollu engellediği için yorum satırına alındı
      //_scrollToBottom();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 100) {
      _triggerPagination();
    }
  }

  void _triggerPagination() async {
    final store = StoreProvider.of<AppState>(context, listen: false);

    final totalCount = widget.selectedChat.totalMessageCount ?? 0;
    final loadedCount = widget.selectedChat.messages?.length ?? 0;

    // Zaten yükleniyor veya yüklenmişse çık
    if (isPaginating || loadedCount >= totalCount) return;

    setState(() {
      isPaginating = true;
    });

    final lastMessageId = widget.selectedChat.messages?.last.id;

    await store.dispatch(
      getMessagesAction(
        store.state.selectedUserInfo!.userId!,
        widget.selectedChat.id!,
        lastMessageId,
      ),
    );

    setState(() {
      isPaginating = false;
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

    // 🔁 Sıralama: Eski → Yeni
    final messages = [...originalMessages]
      ..sort((a, b) => a.sendDate!.compareTo(b.sendDate!));

    // 🗓 Mesajları önce tarihe göre grupla
    final Map<String, List<MessageModel>> dateGroupedMessages = {};

    for (final message in messages) {
      final sendDate = message.sendDate!;
      final dateKey = "${sendDate.year}-${sendDate.month}-${sendDate.day}";

      dateGroupedMessages.putIfAbsent(dateKey, () => []).add(message);
    }

    // 📅 Tarih sıralı anahtarlar
    final sortedDateKeys = dateGroupedMessages.keys.toList()
      ..sort((a, b) {
        final aDate = dateGroupedMessages[a]!.first.sendDate!;
        final bDate = dateGroupedMessages[b]!.first.sendDate!;
        return aDate.compareTo(bDate);
      });

    List<Widget> sliverMessages = [];

    ChatMemberModel? findMember(String sendedUserId) {
      try {
        return widget.selectedChat.members!
            .firstWhere((e) => e.userData?.userId == sendedUserId);
      } catch (_) {
        return null;
      }
    }

    for (final dateKey in sortedDateKeys) {
      final dateMessages = dateGroupedMessages[dateKey]!;

      // 🔽 Saat sırasına göre sırala (en eski saat en önce)
      dateMessages.sort((a, b) => a.sendDate!.compareTo(b.sendDate!));

      final formattedDate = BenekStringHelpers.getSmartFormattedDate(dateMessages.first.sendDate!);

      // 📅 Tarih etiketi
      sliverMessages.add(
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.only(top: 12.0, bottom: 8.0),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.benekWhite.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  formattedDate,
                  style: TextStyle(
                    fontFamily: defaultFontFamily(),
                    fontSize: 12.0,
                    color: AppColors.benekWhite,
                    fontWeight: getFontWeight('medium'),
                  ),
                ),
              ),
            ),
          ),
        ),
      );

      // 👤 Kullanıcıya göre ardışık gruplama
      List<List<MessageModel>> groupedBySender = [];

      for (var message in dateMessages) {
        if (groupedBySender.isEmpty ||
            groupedBySender.last.last.sendedUserId != message.sendedUserId) {
          groupedBySender.add([message]);
        } else {
          groupedBySender.last.add(message);
        }
      }

      for (var group in groupedBySender) {
        group.sort((a, b) => b.sendDate!.compareTo(a.sendDate!));
      }

      for (var group in groupedBySender) {
        final sendedUserId = group[0].sendedUserId;
        final member = findMember(sendedUserId!);

        if (member == null) continue;

        sliverMessages.add(
          MessageElement(
            chatBoxOwnerId: widget.chatBoxOwnerId,
            sendedUserProfileImage: member.userData!.profileImg!,
            messageList: group,
          ),
        );
      }
    }


    // ✅ Listeyi ters çevir (reverse: true ile çalışmak için)
    final reversedSliverMessages = sliverMessages.reversed.toList();

    return ScrollConfiguration(
      behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
      child: CustomScrollView(
        controller: _scrollController,
        reverse: true,
        slivers: reversedSliverMessages,
      ),
    );
  }

}