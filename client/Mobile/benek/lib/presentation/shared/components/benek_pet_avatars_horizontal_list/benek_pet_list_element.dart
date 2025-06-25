import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../common/constants/benek_icons.dart';
import '../../../../common/utils/benek_string_helpers.dart';
import '../../../../common/utils/styles.text.dart';
import '../../../../data/models/user_profile_models/user_info_model.dart';
import '../benek_circle_avatar/benek_circle_avatar.dart';

class BenekPetListElementWidget extends StatefulWidget {
  final PetModel? pet;
  final UserInfo? user;
  final void Function()? onDispatchFunction;
  const BenekPetListElementWidget({
    super.key,
    this.pet,
    this.user,
    this.onDispatchFunction,
  });

  @override
  State<BenekPetListElementWidget> createState() => _BenekPetListElementWidgetState();
}

class _BenekPetListElementWidgetState extends State<BenekPetListElementWidget> {

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onDispatchFunction,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6.0),
        child: Container(
            width: 500.0,
            height: 60.0,
            decoration: const BoxDecoration(
              color:  AppColors.benekLightBlue,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only( left: 12, bottom: 5.0),
                      child: BenekCircleAvatar(
                        isDefaultAvatar: widget.user == null ? widget.pet!.petProfileImg!.isDefaultImg! : widget.user!.profileImg!.isDefaultImg!,
                        imageUrl: widget.user == null ? widget.pet!.petProfileImg!.imgUrl! : widget.user!.profileImg!.imgUrl!,
                        bgColor: AppColors.benekBlack,
                        width: 30,
                        height: 30,
                        borderWidth: 2,
                      ),
                    ),
                    const SizedBox(width: 12.0),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                            widget.user == null
                              ? widget.pet!.name!
                              : BenekStringHelpers.getUsersFullName(
                                  widget.user!.identity!.firstName!,
                                  widget.user!.identity!.lastName!,
                                  widget.user!.identity!.middleName
                              ),
                              style: mediumTextStyle()
                        ),
      
                        Text(
                            widget.user == null
                                ? "${BenekStringHelpers.calculateYearsDifference(widget.pet!.birthDay!)} ${BenekStringHelpers.locale('yearsOld')}, ${BenekStringHelpers.getPetKindAsString(widget.pet!.kind!)}, ${BenekStringHelpers.getPetGenderAsString(widget.pet!.sex!)}"
                                : "@${widget.user!.userName}",
                            style: lightTextStyle()
                        ),
                      ],
                    ),
                  ],
                ),
      
                const Padding(
                  padding: EdgeInsets.only(right: 20.0),
                  child: Icon(
                    BenekIcons.right,
                    color: AppColors.benekBlack,
                    size: 12,
                  ),
                ),
              ],
            )
        ),
      ),
    );
  }
}
