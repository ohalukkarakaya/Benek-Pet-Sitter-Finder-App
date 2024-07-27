import 'package:avatar_stack/avatar_stack.dart';
import 'package:avatar_stack/positions.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:flutter/widgets.dart';

import '../../../data/models/user_profile_models/user_info_model.dart';
import '../../../presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import '../../constants/app_colors.dart';

class StoryFirstFiveLikedUserStackedWidget extends StatelessWidget {
  final int totalLikeCount;
  final List<UserInfo>? users;

  const StoryFirstFiveLikedUserStackedWidget({
    super.key,
    required this.totalLikeCount,
    this.users,
  });

  Widget _buildInfoWidget(int surplus){
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
        child: Center(
          child: Text(
            '+ ${totalLikeCount - users!.length}',
            style: const TextStyle(
              color: AppColors.benekBlack,
              fontSize: 12.0,
              fontWeight: FontWeight.w900,
              fontFamily: 'Qanelas',
            ),
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
           borderWidth: 2,
           isDefaultAvatar: user.profileImg!.isDefaultImg!,
           imageUrl: user.profileImg!.imgUrl!,
         );
       }).toList();

       totalLikeCount - users!.length > 0
        ? widgetList = avatarList.cast<Widget>() + [_buildInfoWidget(totalLikeCount - users!.length)]
        : widgetList = avatarList;

        return widgetList;
     }

     return <Widget>[];
  }

  Widget _buildStackedUserAvatars(){
    return WidgetStack(
        positions: RestrictedPositions(
          maxCoverage: 0.6,
          minCoverage: 0.3,
          align: StackAlign.center,
        ),
        stackedWidgets: _buildUserAvatars(),
        buildInfoWidget: ( surplus ){
          return totalLikeCount - users!.length > 0
          ? _buildInfoWidget(surplus)
          : const SizedBox();
        }
    );
  }

  @override
  Widget build(BuildContext context) {
    return users != null && users!.isNotEmpty
      ? _buildStackedUserAvatars()
      : Center(
          child: Text(
            totalLikeCount > 0 ? BenekStringHelpers.locale('justYou') : BenekStringHelpers.locale('beTheFirstOneToLike'),
            style: const TextStyle(
              color: AppColors.benekWhite,
              fontSize: 12.0,
              fontWeight: FontWeight.w500,
              fontFamily: 'Qanelas',
            ),
          ),
    );
  }
}
