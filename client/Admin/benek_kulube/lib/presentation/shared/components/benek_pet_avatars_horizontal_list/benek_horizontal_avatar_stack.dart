import 'package:avatar_stack/avatar_stack.dart';
import 'package:avatar_stack/positions.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../data/models/pet_models/pet_model.dart';
import '../../../../data/models/user_profile_models/user_info_model.dart';

class BenekHorizontalStackedPetAvatarWidget extends StatelessWidget {
  final List<dynamic>? petList;
  final double size;
  const BenekHorizontalStackedPetAvatarWidget({
    super.key,
    required this.petList,
    this.size = 50.0,
  });

  Widget _buildChild(){
    return SizedBox(
      height: size,
      width: 200,
      child: WidgetStack(
        positions: RestrictedPositions(
          maxCoverage: 0.4,
          minCoverage: 0.1,
          align: StackAlign.center,
        ),
        stackedWidgets: petList!.isNotEmpty ?
          petList!.map((pet) {
            return pet is PetModel
              && pet.petProfileImg != null
                ? BenekCircleAvatar(
                  isDefaultAvatar: pet.petProfileImg!.isDefaultImg!,
                  imageUrl: pet.petProfileImg!.imgUrl!,
                  width: size,
                  height: size,
                )
                : pet is UserInfo
                  && pet.profileImg != null
                  ? BenekCircleAvatar(
                    isDefaultAvatar: pet.profileImg!.isDefaultImg!,
                    imageUrl: pet.profileImg!.imgUrl!,
                    width: size,
                    height: size,
                  )
                  : Container(
                      width: size,
                      height: size,
                      decoration: const BoxDecoration(
                        color: Colors.grey,
                        shape: BoxShape.circle,
                      ),
                    );
          }).toList()
          : [],
          buildInfoWidget: ( surplus ){
            return Container(
              height: size,
              width: size,
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
                    "+ $surplus",
                    style: boldTextStyle( textFontSize: 15.0 ),
                  ),
                ),
              ),
            );
          },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: size,
      child: petList != null
        && petList!.isNotEmpty
        && ( petList![0] is! PetModel && petList![0] is! UserInfo )
          ? Shimmer.fromColors(
              baseColor: AppColors.benekBlack.withOpacity(0.4),
              highlightColor: AppColors.benekBlack.withOpacity(0.2),
              child: _buildChild()
          )
          : petList != null
            && petList!.isNotEmpty
            && ( petList![0] is PetModel || petList![0] is UserInfo )
              ? _buildChild()
              : Center(
                child: Text(
                  BenekStringHelpers.locale('noPetMessage'),
                  style: thinTextStyle(
                    textColor: AppColors.benekWhite,
                    textFontSize: 15.0,
                  ),
                )
            )
    );
  }
}
