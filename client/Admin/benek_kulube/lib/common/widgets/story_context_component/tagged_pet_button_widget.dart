import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/widgets.dart';

import '../../constants/benek_icons.dart';

class TaggedPetButtonWidget extends StatefulWidget {
  final PetModel pet;

  const TaggedPetButtonWidget({
    super.key,
    required this.pet
  });

  @override
  State<TaggedPetButtonWidget> createState() => _TaggedPetButtonWidgetState();
}

class _TaggedPetButtonWidgetState extends State<TaggedPetButtonWidget> {
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
          width: 350.0,
          height: 60.0,
          decoration: BoxDecoration(
            color: isHovering
                ? AppColors.benekBlue
                : AppColors.benekLightBlue,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Container(
                width: 5.0,
                height: 60.0,
                decoration: const BoxDecoration(
                  color: AppColors.benekDarkBlue
                ),
              ),
              const SizedBox(width: 12.0),
              Stack(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only( bottom: 5.0),
                      child: BenekCircleAvatar(
                        isDefaultAvatar: widget.pet.petProfileImg!.isDefaultImg!,
                        imageUrl: widget.pet.petProfileImg!.imgUrl!,
                        bgColor: AppColors.benekBlack,
                        borderWidth: 2,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 20.0, top: 15.0),
                      child: BenekCircleAvatar(
                        isDefaultAvatar: widget.pet.primaryOwner!.profileImg!.isDefaultImg!,
                        imageUrl: widget.pet.primaryOwner!.profileImg!.imgUrl!,
                        width: 30,
                        height: 30,
                        borderWidth: 2,
                        bgColor: AppColors.benekBlack,
                      ),
                    ),
                  ]
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
          )
        ),
      ),
    );
  }
}
