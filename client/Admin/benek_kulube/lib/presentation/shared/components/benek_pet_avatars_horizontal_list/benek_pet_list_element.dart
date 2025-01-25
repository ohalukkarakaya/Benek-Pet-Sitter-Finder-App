import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../common/constants/benek_icons.dart';
import '../../../../common/utils/benek_string_helpers.dart';
import '../../../../common/utils/styles.text.dart';
import '../benek_circle_avatar/benek_circle_avatar.dart';

class BenekPetListElementWidget extends StatefulWidget {
  final PetModel pet;
  const BenekPetListElementWidget({
    super.key,
    required this.pet,
  });

  @override
  State<BenekPetListElementWidget> createState() => _BenekPetListElementWidgetState();
}

class _BenekPetListElementWidgetState extends State<BenekPetListElementWidget> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onHover: (event) {
        setState(() {
          isHovering = true;
        });
      },
      onExit: (event) {
        setState(() {
          isHovering = false;
        });
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6.0),
        child: Container(
            width: 500.0,
            height: 60.0,
            decoration: BoxDecoration(
              color: isHovering
                  ? AppColors.benekBlue
                  : AppColors.benekLightBlue,
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
                        isDefaultAvatar: widget.pet.petProfileImg!.isDefaultImg!,
                        imageUrl: widget.pet.petProfileImg!.imgUrl!,
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
                            widget.pet.name!,
                            style: mediumTextStyle()
                        ),

                        Text(
                            "${BenekStringHelpers.calculateYearsDifference(widget.pet.birthDay!)} ${BenekStringHelpers.locale('yearsOld')}, ${BenekStringHelpers.getPetKindAsString(widget.pet.kind!)}, ${BenekStringHelpers.getPetGenderAsString(widget.pet.sex!)}",
                            style: lightTextStyle()
                        ),
                      ],
                    ),
                  ],
                ),

                Padding(
                  padding: const EdgeInsets.only(right: 20.0),
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
