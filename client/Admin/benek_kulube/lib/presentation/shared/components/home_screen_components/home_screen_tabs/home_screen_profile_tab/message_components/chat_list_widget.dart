import 'dart:async';
import 'dart:developer';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/chat_preview_element.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/data/models/chat_models/chat_model.dart';
import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../../../../../../common/constants/benek_icons.dart';
import '../../../../../../../common/utils/styles.text.dart';

class ChatListWidget extends StatefulWidget {
  const ChatListWidget({super.key});

  @override
  State<ChatListWidget> createState() => _ChatListWidgetState();
}

class _ChatListWidgetState extends State<ChatListWidget> {
  ChatModel? selectedChat;
  bool isWaitingForPagination = false;
  bool shouldPaginate = false;

  final TextEditingController _searchController = TextEditingController();
  Timer? _searchTimer;
  String searchText = '';

  @override
  void initState() {
    super.initState();

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

    if (!isWaitingForPagination && index >= (currentListLength - 3) && currentListLength < totalCount) {
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
    int? lastItemIndex = store.state.selectedUserInfo!.chatData?.chats?.length != null
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
            ? store.state.selectedUserInfo!.chatData!.chats![lastItemIndex]!.id.toString()
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
      converter: (store) {
        if (searchText.trim().length > 1 && store.state.selectedUserInfo?.searchedChatData != null) {
          return store.state.selectedUserInfo!.searchedChatData;
        }
        return store.state.selectedUserInfo?.chatData;
      },
      builder: (context, chatState) {
        final List<ChatModel?> chats = chatState?.chats ?? [];
        Store<AppState> store = StoreProvider.of<AppState>(context);

        if (shouldPaginate && searchText.trim().isEmpty) {
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
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(16),
                    bottomLeft: Radius.circular(16),
                  ),
                ),
                child: Column(
                  children: [
                    // 🔍 Arama Barı
                    Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: TextField(
                        controller: _searchController,
                        cursorColor: AppColors.benekBlack,
                        decoration: InputDecoration(
                          hintText: BenekStringHelpers.locale('searchChat'),
                          hintStyle: thinTextStyle( textFontSize: 20.0 ),
                          suffixIcon: const Padding(
                            padding: EdgeInsets.only(right: 25.0),
                            child: Icon(
                                BenekIcons.searchcircle,
                                color: AppColors.benekBlack,
                            ),
                          ),
                          filled: true,
                          fillColor: AppColors.benekLightBlue,
                          contentPadding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
                          border: const OutlineInputBorder(
                            borderRadius: BorderRadius.all( Radius.circular( 6.0 ) ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(6.0),
                          ),
                        ),
                        style: regularTextStyle( textFontSize: 20.0 ),
                        onChanged: (value) {
                          _searchTimer?.cancel();

                          setState(() {
                            searchText = value;
                          });

                          store.dispatch(resetChatAsAdminRequest());

                          _searchTimer = Timer(const Duration(seconds: 1), () {
                            final trimmed = searchText.trim();
                            if (trimmed.length > 1) {
                              store.dispatch(searchChatAsAdminRequest(
                                store.state.selectedUserInfo!.userId!,
                                trimmed,
                              ));
                              log('Searching chat: $trimmed');
                            } else {
                              store.dispatch(resetUserSearchDataAction());
                            }
                          });
                        },
                      ),
                    ),

                    // 💬 Chat Listesi
                    Expanded(
                      child: (chats.isEmpty && searchText.trim().length > 1)
                        ? Center(
                          child: Text(
                            BenekStringHelpers.locale('notFoundMessage'),
                            style: TextStyle(color: Colors.white70, fontSize: 16),
                          ),
                        )
                        : ScrollConfiguration(
                          behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                          child: ListView.builder(
                            itemCount: chats.length,
                            itemBuilder: (context, index) {
                              final ChatModel chat = chats[index]!;

                              if (searchText.trim().isEmpty) {
                                _checkIfPaginationNeeded(store, index, chatState?.totalChatCount ?? 0);
                              }

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
                                    chatInfo: chat,
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                    ),
                  ],
                ),
              ),
            ),

            // Sağ Panel - Mesaj Alanı
            Expanded(
              flex: 6,
              child: Container(
                height: double.infinity,
                color: Colors.blue[600],
                child: Center(
                  child: Text(
                    selectedChat != null ? selectedChat!.chatDesc! : 'Seçili Chat Yok',
                    style: const TextStyle(color: Colors.white, fontSize: 18),
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