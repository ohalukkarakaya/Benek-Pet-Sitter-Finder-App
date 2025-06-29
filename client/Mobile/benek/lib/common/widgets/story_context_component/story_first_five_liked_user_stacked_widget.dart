import 'package:avatar_stack/avatar_stack.dart';
import 'package:avatar_stack/positions.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';


import '../../../data/models/user_profile_models/user_info_model.dart';
import '../../../presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import '../../constants/app_colors.dart';

class StoryFirstFiveLikedUserStackedWidget extends StatelessWidget {
  final bool isCentered;
  final int totalLikeCount;
  final List<UserInfo>? users;
  final Color backgroundColor;
  final double borderWidth;

  const StoryFirstFiveLikedUserStackedWidget({
    super.key,
    this.isCentered = true,
    required this.totalLikeCount,
    this.users,
    this.backgroundColor = AppColors.benekWhite,
    this.borderWidth = 2,
  });

  Widget _buildInfoWidget(int surplus){

    int count = users != null && users!.length > 5
        ? totalLikeCount - 5
        : totalLikeCount - users!.length;

    return Container(
      height: 35,
      width: 35,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(100),
      ),
      padding: EdgeInsets.all( borderWidth.toDouble() ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(100),
          color: AppColors.benekLightBlue,
        ),
        child: Center(
          child: Text(
            '+ $count',
            style: blackTextStyle()
          ),
        ),
      ),
    );
  }

  List<Widget> _buildUserAvatars(){
     if(users != null && users!.isNotEmpty){

       List<Widget> widgetList = [];

       List<Widget> avatarList = users!.take(5).map((user) {
         return BenekCircleAvatar(
           width: 35,
           height: 35,
           borderWidth: borderWidth,
           isDefaultAvatar: user.profileImg!.isDefaultImg!,
           imageUrl: user.profileImg!.imgUrl!,
           bgColor: backgroundColor,
         );
       }).toList();

       users!.length > 5 || totalLikeCount - users!.length > 0
        ? widgetList = avatarList.cast<Widget>() + [_buildInfoWidget(totalLikeCount - users!.length)]
        : widgetList = avatarList;

        return widgetList;
     }

     return <Widget>[];
  }

  Widget _buildStackedUserAvatars(bool isCentered){
    return WidgetStack(
        positions: RestrictedPositions(
          maxCoverage: 0.6,
          minCoverage: 0.3,
          align: isCentered ? StackAlign.center : StackAlign.right,
        ),
        stackedWidgets: _buildUserAvatars(),
        buildInfoWidget: ( surplus ){
          return users!.length > 5 || totalLikeCount - users!.length > 0
          ? _buildInfoWidget(surplus)
          : const SizedBox();
        }
    );
  }

  @override
  Widget build(BuildContext context) {
    return users != null && users!.isNotEmpty
      ? _buildStackedUserAvatars(isCentered)
      : Center(
          child: Text(
            totalLikeCount > 0 ? BenekStringHelpers.locale('justYou') : BenekStringHelpers.locale('beTheFirstOneToLike'),
            style: mediumTextStyle( textColor: AppColors.benekWhite ),
          ),
    );
  }
}
