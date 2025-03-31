import 'package:avatar_stack/avatar_stack.dart';
import 'package:avatar_stack/positions.dart';
import 'package:benek_kulube/data/models/chat_models/chat_member_model.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../benek_circle_avatar/benek_circle_avatar.dart';

class ChatStackedProfile extends StatelessWidget {

  final String chatOwnerUserId;
  final List<ChatMemberModel>? chatMembers;

  const ChatStackedProfile({
    super.key,
    required this.chatOwnerUserId,
    this.chatMembers
  });


  Widget _buildStackedProfile(){

    List<ChatMemberModel>? memberList = chatMembers != null && chatMembers!.isNotEmpty
      ? chatMembers!.where(
            (member) =>
                member.userData != null ?
                    member.userData!.userId != chatOwnerUserId
                    : false ).toList()
      : [];

    return WidgetStack(
      positions: RestrictedPositions(
        maxCoverage: 0.4,
        minCoverage: 0.3,
        align: StackAlign.left,
      ),
      stackedWidgets: memberList.isNotEmpty ?
        memberList.map((member) {
          return member is ChatMemberModel
            && member.userData != null
            && member.userData!.profileImg != null
              ? BenekCircleAvatar(
                width: 35,
                height: 35,
                borderWidth: 2,
                isDefaultAvatar: member.userData!.profileImg!.isDefaultImg!,
                imageUrl: member.userData!.profileImg!.imgUrl!,
              )
              : const SizedBox();
        }).toList()
        : [],
        buildInfoWidget: ( surplus ){
          return Container(
            height: 35,
            width: 35,
            decoration: BoxDecoration(
              color: AppColors.benekWhite,
              borderRadius: BorderRadius.circular(100),
            ),
            padding: const EdgeInsets.all(4),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(100),
                color: AppColors.benekLightBlue,
              ),
            ),
          );
        }
    );
  }

  @override
  Widget build(BuildContext context) {

    final memberCount = chatMembers?.length ?? 0;
    final double overlapOffset = 20.0;
    final double avatarDiameter = 35.0;

    final double width = memberCount > 0
        ? avatarDiameter + (memberCount - 1) * overlapOffset
        : 0;

    return SizedBox(
      width: width,
      height: avatarDiameter,
      child: memberCount > 0
          ? _buildStackedProfile()
          : const SizedBox(),
    );
  }
}
