import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/chat_loading_element.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/chat_preview_element.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class ChatPreviewWidget extends StatelessWidget {
  final double height;
  final double width;
  final ChatStateModel chatInfo;
  const ChatPreviewWidget({
    super.key,
    this.height = 350,
    this.width = 350,
    required this.chatInfo
  });

  @override
  Widget build(BuildContext context) {

    int itemCount = chatInfo.chats != null
      ? chatInfo.chats!.length >= 5
        ? 5
        : chatInfo.chats!.length
      : 0;
    return Padding(
      padding: const EdgeInsets.only(
          top: 20.0,
          right: 40.0
      ),
      child: Container(
        width: width,
        decoration: BoxDecoration(
          color: AppColors.benekBlackWithOpacity,
          borderRadius: BorderRadius.circular(10.0),
        ),
        padding: const EdgeInsets.all(10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  BenekStringHelpers.locale('usersMessagesTitle'),
                  style: const TextStyle(
                    fontFamily: 'Qanelas',
                    fontSize: 12,
                    color: AppColors.benekWhite,
                    fontWeight: FontWeight.w400,
                  ),
                ),

                const SizedBox( width: 10.0),

                Text(
                  chatInfo.totalChatCount != null
                      ? chatInfo.totalChatCount.toString() : '0',
                  style: const TextStyle(
                    fontFamily: 'Qanelas',
                    fontSize: 12,
                    color: AppColors.benekWhite,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),

            const Divider(color: AppColors.benekWhite, thickness: 0.5),

            const SizedBox(height: 10.0),

            chatInfo.chats != null
              ? ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: itemCount,
                itemBuilder: (context, index) {
                  return chatInfo.chats == null
                      ? const ChatLoadingElement()
                      : chatInfo.chats != null && chatInfo.chats!.isEmpty
                        ? const SizedBox()
                        : Column(
                          children: [
                            ChatPreviewElement(
                                chatInfo: chatInfo.chats![index]!
                            ),
                            index < itemCount - 1
                                ? const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 10.0),
                                  child: Divider(color: AppColors.benekWhite, thickness: 0.5),
                                )
                                : const SizedBox(),
                          ],
                        );
                }
              )
              : Center(
                  child: Text(
                    BenekStringHelpers.locale('emptyMessageBoxTitle'),
                    style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 12,
                      color: AppColors.benekWhite,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                )
          ],
        )
      ),
    );
  }
}
