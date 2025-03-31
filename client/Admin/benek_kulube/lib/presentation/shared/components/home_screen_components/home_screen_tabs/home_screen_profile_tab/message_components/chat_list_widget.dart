import 'dart:developer';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/chat_preview_element.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/data/models/chat_models/chat_model.dart';
import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

class ChatListWidget extends StatefulWidget {
  const ChatListWidget({super.key});

  @override
  State<ChatListWidget> createState() => _ChatListWidgetState();
}

class _ChatListWidgetState extends State<ChatListWidget> {
  ChatModel? selectedChat;
  bool isWaitingForPagination = false;
  bool shouldPaginate = false;

  @override
  void initState() {
    super.initState();

    // Varsayılan olarak ilk chat’i seçili yap
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final store = StoreProvider.of<AppState>(context, listen: false);
      final chats = store.state.selectedUserInfo?.chatData?.chats ?? [];
      if (chats.isNotEmpty && selectedChat == null) {
        setState(() {
          selectedChat = chats.first;
        });
      }
    });
  }

  void _onChatSelected(ChatModel chat) {
    setState(() {
      selectedChat = chat;
    });
  }

  void _checkIfPaginationNeeded(Store<AppState> store, int index, int totalChats) {

    final currentListLength = store.state.selectedUserInfo?.chatData?.chats?.length ?? 0;
    final totalCount = store.state.selectedUserInfo?.chatData?.totalChatCount ?? 0;

    if (
    !isWaitingForPagination &&
        index >= (currentListLength - 3)
        && currentListLength < totalCount
    ) {
      Future.microtask(() {
        if (mounted) {
          setState(() {
            shouldPaginate = true;
            isWaitingForPagination = true;
          });
        }
      });
    }
  }


  void _paginateChats(Store<AppState> store) async {
    int? lastItemIndex = store.state.selectedUserInfo!.chatData != null &&
        store.state.selectedUserInfo!.chatData?.chats != null
        ? store.state.selectedUserInfo!.chatData!.chats!.length - 1
        : null;

    if (shouldPaginate) {
      setState(() {
        isWaitingForPagination = true;
        shouldPaginate = false;
      });

      await store.dispatch(getUsersChatAsAdminRequestAction(
        store.state.selectedUserInfo!.userId!,
        lastItemIndex != null
            ? store.state.selectedUserInfo!.chatData!.chats![lastItemIndex]!.id
            .toString()
            : null,
      ));

      setState(() {
        isWaitingForPagination = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, ChatStateModel?>(
      converter: (store) => store.state.selectedUserInfo!.chatData,
      builder: (context, chatState) {
        final List<ChatModel?> chats = chatState?.chats ?? [];

        Store<AppState> store = StoreProvider.of<AppState>(context);

        if (shouldPaginate) {
          Future.microtask(() {
            if (mounted) {
              _paginateChats(store);
            }
          });
        }
        return Row(
          children: [
            // Sol Panel - Chat Listesi
            Expanded(
              flex: 4,
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.benekBlack,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(16),
                    bottomLeft: Radius.circular(16),
                  ),
                ),
                child: ScrollConfiguration(
                  behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                  child: ListView.builder(
                    itemCount: chats.length,
                    itemBuilder: (context, index) {
                      final ChatModel chat = chats[index]!;

                      _checkIfPaginationNeeded(StoreProvider.of<AppState>(context), index, chatState?.totalChatCount ?? 0);

                      return GestureDetector(
                        onTap: () => _onChatSelected(chat),
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                          decoration: BoxDecoration(
                            color: selectedChat?.id == chat.id
                                ? Colors.blueAccent.withOpacity(0.4)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: ChatPreviewElement(
                              chatOwnerUserId: store.state.selectedUserInfo!.userId!,
                              chatInfo: chat
                          )
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),

            // Sağ Panel - Mesaj Alanı (şimdilik sadece mavi kutu)
            Expanded(
              flex: 6,
              child: Container(
                height: double.infinity,
                color: Colors.blue[600],
                child: Center(
                  child: Text(
                    selectedChat != null ? selectedChat!.chatDesc! : 'Seçili Chat Yok',
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

