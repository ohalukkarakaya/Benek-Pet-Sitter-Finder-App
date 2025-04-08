import 'package:benek_kulube/common/constants/message_type_enum.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/unread_messages_badge.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../data/models/chat_models/chat_member_model.dart';
import '../../../../../../../data/models/chat_models/chat_model.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import 'chat_preview_element_message_component.dart';
import 'chat_stacked_profile.dart';


class ChatPreviewElement extends StatelessWidget {
  final String chatOwnerUserId;
  final ChatModel chatInfo;
  const ChatPreviewElement({
    super.key,
    required this.chatOwnerUserId,
    required this.chatInfo,
  });

  @override
  Widget build(BuildContext context) {

    bool areThereUnreadMessages = chatInfo.unreadMessageCount != null && chatInfo.unreadMessageCount! > 0;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        ChatStackedProfile(
            chatOwnerUserId: chatOwnerUserId,
            chatMembers: chatInfo.members
        ),
        const SizedBox(width: 10.0),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              chatInfo.messages != null
              && chatInfo.messages!.isNotEmpty
              && chatInfo.messages![0] != null
              && chatInfo.members != null
              && chatInfo.messages![0].sendedUserId != null
              && (
                  chatInfo.messages![0].message != null ||
                  chatInfo.messages![0].fileUrl != null ||
                  chatInfo.messages![0].paymentOffer != null
              )
                ? ChatPreviewElementMessageComponent(
                  areThereUnreadMessages: areThereUnreadMessages,
                  senderUserName: chatInfo.members!.firstWhere(
                        (user) =>
                            user.userData!.userId == chatInfo.messages![0].sendedUserId!,
                        orElse: () => ChatMemberModel(
                          userData: UserInfo(userName: ""),
                          joinDate: null,
                        ),
                  ).leaveDate == null
                      ? chatInfo.members!.firstWhere(
                        (user) =>
                    user.userData!.userId == chatInfo.messages![0].sendedUserId!,
                    orElse: () => ChatMemberModel(
                      userData: UserInfo(userName: ""),
                      joinDate: null,
                    ),
                  ).userData!.userName!
                  : BenekStringHelpers.locale('missingUser'),
                  message: chatInfo.messages![0].messageType != MessageTypeEnum.UNDEFINED
                      ? chatInfo.messages![0].message != null
                        ? chatInfo.messages![0].message!
                        : getMessageTypeTitle(
                            chatInfo.messages![0].messageType!
                        )
                      : BenekStringHelpers.locale('undefinedMessageType'),
               )
               : ChatPreviewElementMessageComponent(
                  areThereUnreadMessages: areThereUnreadMessages,
                  senderUserName: "",
                  message: "${BenekStringHelpers.getDateAsString(chatInfo.chatStartDate!)} ${BenekStringHelpers.locale('createdAt')}",
               ),
            ],
          ),
        ),

        const SizedBox(width: 10.0),

        areThereUnreadMessages
          ? UnreadMessagesBadge(unreadMessageCount: chatInfo.unreadMessageCount!)
          : const SizedBox(),
      ],
    );
  }
}
