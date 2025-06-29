import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/widgets/approve_screen.dart';
import 'package:benek/data/models/chat_models/chat_model.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/message_components/select_members_screen.dart';
import 'package:benek/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:benek/redux/chat_moderating/get_users_chat_as_admin/get_users_chat_as_admin.action.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../data/models/chat_models/chat_member_model.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek/store/app_state.dart';

import 'chat_detail_button_widget.dart';

class ChatInfoScreen extends StatefulWidget {
  final String userId;
  final ChatModel chatInfo;
  final Future<void> Function() onChatLeave;

  const ChatInfoScreen({
    super.key,
    required this.userId,
    required this.chatInfo,
    required this.onChatLeave,
  });

  @override
  State<ChatInfoScreen> createState() => _ChatInfoScreenState();
}

class _ChatInfoScreenState extends State<ChatInfoScreen> {
  bool idle = true;

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    List<ChatMemberModel>? filteredMembers = List.from(widget.chatInfo.members!)
      ..removeWhere((element) => element.leaveDate != null);

    if (filteredMembers.length > 1) {
      filteredMembers.removeWhere((element) => element.userData!.userId == widget.userId);
    }

    bool isUsersOwnChat = store.state.selectedUserInfo!.userId == store.state.userInfo!.userId;

    List<UserInfo> existingUsers = widget.chatInfo.members!.where((element) => element.userData!.userId != widget.userId ).map((e) => e.userData!).toList();

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () => Navigator.of(context).pop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: SizedBox(
            width: 650,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 650,
                  decoration: BoxDecoration(
                    color: AppColors.benekWhite.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 15.0),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 15.0),
                          child: Text(
                            maxLines: 4,
                            overflow: TextOverflow.ellipsis,
                            widget.chatInfo.chatDesc!,
                            style: regularTextStyle(
                                textColor: AppColors.benekWhite,
                                textFontSize: 12.0
                            ),
                            softWrap: true,
                          ),
                        ),

                        const SizedBox(height: 25.0),

                        Padding(
                          padding: const EdgeInsets.only(left: 10.0, bottom: 15.0),
                          child: Row(
                              children: List.generate(
                                  filteredMembers != null
                                      ? filteredMembers.length
                                      : 0,
                                  (index){
                                    UserInfo userData = filteredMembers[index].userData!;
                                    return Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 5.0),
                                      child: Container(
                                        width: 115.0,
                                        padding: const EdgeInsets.all(10.0),
                                        decoration: BoxDecoration(
                                          color: AppColors.benekLightBlue,
                                          borderRadius: BorderRadius.circular(6.0),
                                        ),
                                        child: Column(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          crossAxisAlignment: CrossAxisAlignment.center,
                                          children: [
                                            BenekCircleAvatar(
                                              width: 45.0,
                                              height: 45.0,
                                              radius: 30.0,
                                              isDefaultAvatar: userData.profileImg!.isDefaultImg!,
                                              imageUrl: userData.profileImg!.imgUrl!,
                                              bgColor: AppColors.benekBlack,
                                            ),

                                            const SizedBox(height: 10.0),

                                            Text(
                                              userData.userName!,
                                              style: TextStyle(
                                                fontFamily: defaultFontFamily(),
                                                fontSize: 12.0,
                                                fontWeight: getFontWeight('regular'),
                                                color: AppColors.benekBlack,
                                              ),
                                              overflow: TextOverflow.ellipsis,
                                              softWrap: false,
                                            )
                                          ],
                                        ),
                                      ),
                                    );
                                  }
                              )
                          ),
                        ),
                    ],
                  ),
                ),

                SizedBox(
                    height: isUsersOwnChat
                      ? 15.0
                      : 0.0
                ),

                isUsersOwnChat
                 ? Row(
                  children: [
                    ChatDetailButtonWidget(
                      chat: widget.chatInfo,
                      icon: BenekIcons.plus,
                      iconSize: 20.0,
                      isLight: true,
                      onTap: () async {
                        List<UserInfo?>? members = await Navigator.push(
                          context,
                          PageRouteBuilder(
                            opaque: false,
                            barrierDismissible: false,
                            pageBuilder: (context, _, __) => SelectMembersScreen(
                              desc: widget.chatInfo.chatDesc!,
                              existingMembers: existingUsers,
                            ),
                            )
                          );

                        if( members == null ){ return; }

                        List<UserInfo?> differentMembers = members.where((element) => !existingUsers.contains(element)).toList();
                        if( differentMembers == null || differentMembers.isEmpty ) {  return; }

                        differentMembers.removeWhere((element) => element!.userId == store.state.selectedUserInfo!.userId!);


                        await store.dispatch(addMembersToChat(widget.chatInfo.id!, differentMembers.whereType<UserInfo>().toList()));
                        setState(() {
                          idle = !idle;
                        });
                        },
                    ),

                    const SizedBox(width: 10.0),

                    ChatDetailButtonWidget(
                      onTap: () async {

                        bool didApprove = await Navigator.push(
                          context,
                          PageRouteBuilder(
                            opaque: false,
                            barrierDismissible: false,
                            pageBuilder: (context, _, __) => ApproveScreen(title: BenekStringHelpers.locale('leaveChat')),
                          ),
                        );

                        if( !didApprove ){ return; }

                        await widget.onChatLeave();

                        setState(() {
                          idle = !idle;
                        });
                        Navigator.of(context).pop();
                      },
                      chat: widget.chatInfo,
                      icon: Icons.logout,
                      iconSize: 25.0,
                      isLight: true,
                    ),
                  ],
                )
                : const SizedBox(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
