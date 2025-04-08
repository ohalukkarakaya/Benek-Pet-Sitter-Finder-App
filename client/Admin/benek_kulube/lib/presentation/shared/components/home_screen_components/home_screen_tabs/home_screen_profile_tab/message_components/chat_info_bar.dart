import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/data/models/chat_models/chat_member_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../data/models/chat_models/chat_model.dart';
import 'chat_info_screen.dart';
import 'chat_preview_element_message_component.dart';
import 'chat_stacked_profile.dart';

class ChatInfoBar extends StatelessWidget {
  final List<ChatMemberModel> memberList;
  final String chatDesc;
  final ChatModel chat;
  final Future<void> Function() onChatLeave;

  const ChatInfoBar({
    super.key,
    required this.memberList,
    required this.chatDesc,
    required this.chat,
    required this.onChatLeave,
  });

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    return Container(
      decoration: BoxDecoration(
        color: AppColors.benekWhite.withOpacity(0.1),
        borderRadius: BorderRadius.only(
          topRight:  Radius.circular(16.0), topLeft: Radius.circular(16.0),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 15.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ChatStackedProfile(
                chatOwnerUserId: store.state.selectedUserInfo!.userId!,
                chatMembers: memberList
            ),
            const SizedBox(width: 10.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RichText(
                    overflow: TextOverflow.ellipsis,
                    maxLines: 3,
                    text: TextSpan(
                      text: chatDesc,
                      style: TextStyle(
                        fontFamily: defaultFontFamily(),
                        fontSize: 12.0,
                        color: AppColors.benekWhite,
                        fontWeight: getFontWeight('medium'),
                      ),
                    ),
                  )
                ],
              ),
            ),

            IconButton(
              onPressed: (){
                Navigator.push(
                  context,
                  PageRouteBuilder(
                    opaque: false,
                    barrierDismissible: false,
                    pageBuilder: (context, _, __) => ChatInfoScreen(
                      userId: store.state.userInfo!.userId!,
                      chatInfo: chat,
                      onChatLeave: onChatLeave,
                    ),
                  ),
                );
              },
              icon: const Icon(
                Icons.more_vert_outlined,
                color: AppColors.benekWhite,
                size: 20.0,
              ),
            )
          ],
        ),
      ),
    );
  }
}
