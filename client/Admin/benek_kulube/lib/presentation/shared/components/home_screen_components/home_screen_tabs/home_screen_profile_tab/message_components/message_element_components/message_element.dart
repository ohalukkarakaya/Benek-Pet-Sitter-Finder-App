import 'package:benek_kulube/data/models/chat_models/message_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/message_element_components/message_avatar.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/message_element_components/message_dialog_components/message_dialog_box.dart';
import 'package:flutter/material.dart';
import 'package:flutter_sticky_header/flutter_sticky_header.dart';

class MessageElement extends StatelessWidget {
  final String chatBoxOwnerId;
  final List<MessageModel> messageList;
  final UserProfileImg sendedUserProfileImage;

  const MessageElement({
    super.key,
    required this.chatBoxOwnerId,
    required this.messageList,
    required this.sendedUserProfileImage,
  });

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: const EdgeInsets.only(
        bottom: 15.0,
        left: 20.0,
        right: 20.0,
      ),
      sliver: SliverStickyHeader(
        overlapsContent: true,
        header: Padding(
          padding: const EdgeInsets.only(bottom: 8.0),
          child: MessageAvatarWidget(
            userProfileImage: sendedUserProfileImage,
            shouldDisplayAtLeft: messageList[0].sendedUserId != chatBoxOwnerId,
          ),
        ),
        sliver: SliverList(
          delegate: SliverChildBuilderDelegate(
                (context, index) => MessageDialogBox(
                  shouldDisplayAtLeft: messageList[index].sendedUserId != chatBoxOwnerId,
                  messageType: messageList[index].messageType!,
                  message: messageList[index].message,
                  fileUrl: messageList[index].fileUrl,
                  paymentOffer: messageList[index].paymentOffer,
                  sendDate: index == 0
                      ? messageList[index].sendDate!
                      : null,
                ),
            childCount: messageList.length,
          ),
        ),
      ),
    );
  }
}
