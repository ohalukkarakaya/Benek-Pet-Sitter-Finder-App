import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/chat_loading_element.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/message_components/chat_preview_element.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class ChatPreviewWidget extends StatefulWidget {
  final double height;
  final double width;
  final String chatOwnerUserId;
  final ChatStateModel? chatInfo;
  final bool isLoading;

  const ChatPreviewWidget({
    super.key,
    this.height = 350,
    this.width = 350,
    required this.chatOwnerUserId,
    required this.chatInfo,
    this.isLoading = true
  });

  @override
  State<ChatPreviewWidget> createState() => _ChatPreviewWidgetState();
}

class _ChatPreviewWidgetState extends State<ChatPreviewWidget> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    int itemCount = widget.chatInfo != null && widget.chatInfo!.chats != null
      ? widget.chatInfo!.chats!.length >= 3
        ? 3
        : widget.chatInfo!.chats!.length
      : 0;
    return Padding(
      padding: const EdgeInsets.only(
          top: 20.0,
          bottom: 20.0,
          right: 40.0
      ),
      child: MouseRegion(
        onEnter: (event) {
          if( widget.chatInfo != null && widget.chatInfo!.chats != null && widget.chatInfo!.chats!.isNotEmpty ) {
            setState(() {
              isHovering = true;
            });
          }
        },
        onExit: (event) {
          setState(() {
            isHovering = false;
          });
        },
        child: Stack(
          children: [
            Container(
              width: widget.width,
              decoration: BoxDecoration(
                color: isHovering ? AppColors.benekBlack.withOpacity(0.5) : AppColors.benekBlackWithOpacity,
                borderRadius: BorderRadius.circular(5.0),
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
                        style: regularTextStyle( textColor: AppColors.benekWhite ),
                      ),

                      const SizedBox( width: 10.0),

                      Text(
                        widget.chatInfo != null
                        && widget.chatInfo!.totalChatCount != null
                            ? widget.chatInfo!.totalChatCount.toString() : '0',
                        style: regularTextStyle( textColor: AppColors.benekWhite ),
                      ),
                    ],
                  ),

                  const Divider(color: AppColors.benekWhite, thickness: 0.5),

                  const SizedBox(height: 10.0),

                  widget.chatInfo != null
                  && widget.chatInfo!.chats != null
                  && widget.chatInfo!.chats!.isNotEmpty
                  || widget.isLoading
                    ? ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: widget.isLoading ? 3 : itemCount,
                      itemBuilder: (context, index) {
                        return widget.isLoading
                        || widget.chatInfo == null
                        || (
                         widget.chatInfo != null
                         && widget.chatInfo!.chats == null
                        )
                            ? const ChatLoadingElement()
                            : widget.chatInfo != null && widget.chatInfo!.chats != null && widget.chatInfo!.chats!.isEmpty
                              ? const SizedBox()
                              : Column(
                                children: [
                                  ChatPreviewElement(
                                      chatOwnerUserId: widget.chatOwnerUserId,
                                      chatInfo: widget.chatInfo!.chats![index]!
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
                    : Padding(
                      padding: const EdgeInsets.symmetric( vertical: 70.0 ),
                      child: Center(
                          child: Text(
                            BenekStringHelpers.locale('emptyMessageBoxTitle'),
                            style: regularTextStyle( textColor: AppColors.benekWhite ),
                          ),
                        ),
                    )
                ],
              )
            ),
            widget.chatInfo != null
            && widget.chatInfo!.chats != null
            && widget.chatInfo!.chats!.isNotEmpty
            && !(widget.isLoading)
                ? Positioned(
                  bottom: 0,
                  child: Container(
                      width: 310,
                      decoration: BoxDecoration(
                        color: AppColors.benekWhite,
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(5.0),
                          bottomRight: Radius.circular(5.0),
                        ),
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [
                            AppColors.benekBlack.withOpacity(0.8),
                            AppColors.benekBlack.withOpacity(0.0),
                          ],
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.only(top: 30.0, bottom: 20.0),
                        child: Center(
                          child: Text(
                            BenekStringHelpers.locale('seeDetails'),
                            style: TextStyle(
                              color: AppColors.benekWhite,
                              fontFamily: defaultFontFamily(),
                              fontSize: 12,
                              fontWeight: isHovering ? getFontWeight('semiBold') : getFontWeight('regular'),
                            ),
                          ),
                        ),
                      )
                  ),
                )
                : const SizedBox(),
          ],
        ),
      ),
    );
  }
}
