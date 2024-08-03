import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/common/widgets/story_context_component/story_first_five_liked_user_stacked_widget.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

class KulubePetCard extends StatefulWidget {
  const KulubePetCard({
    super.key,
    required this.index,
    required this.indexOfLastRevealedItem,
    required this.resultData,
    this.onAnimationComplete,
    this.onPetHoverCallback,
    this.onPetHoverExitCallback
  });

  final int index;
  final int indexOfLastRevealedItem;
  final PetModel resultData;
  final void Function()? onAnimationComplete;
  final Function( PetModel )? onPetHoverCallback;
  final Function()? onPetHoverExitCallback;

  @override
  State<KulubePetCard> createState() => _KulubePetCardState();
}

class _KulubePetCardState extends State<KulubePetCard> {
  bool isHovering = false;
  bool startAnimation = false;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      setState(() {
        startAnimation = true;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    int indexForAnimationDuration = widget.index - widget.indexOfLastRevealedItem;

    String petKind = widget.resultData.kind != null ? BenekStringHelpers.getPetKindAsString(widget.resultData.kind!) : "";
    return MouseRegion(
      onHover: ( event ){
        widget.onPetHoverCallback!(widget.resultData);
        setState(() {
          isHovering = true;
        });
      },
      onExit: (event) {
        widget.onPetHoverExitCallback!();
        setState(() {
          isHovering = false;
        });
      },
      child: Container(
        decoration: BoxDecoration(
          color: isHovering ? AppColors.benekLightBlue : AppColors.benekBlack,
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),

        // Reveal Animation
        child: AnimatedContainer(
          duration: Duration( milliseconds: 300 + ((indexForAnimationDuration * 10) + 100) ),
          transform: widget.indexOfLastRevealedItem < widget.index
              ? Matrix4.translationValues(startAnimation ? 0 : screenWidth, 0, 0)
              : null,
          onEnd: (){
            widget.onAnimationComplete!();
          },
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                BenekCircleAvatar(
                  imageUrl: widget.resultData.petProfileImg!.imgUrl!,
                  width: 40.0,
                  height: 40.0,
                  radius: 20.0,
                  isDefaultAvatar: widget.resultData.petProfileImg!.isDefaultImg!,
                  bgColor: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                ),
                const SizedBox(width: 8.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.resultData.name!,
                            style: isHovering
                              ? mediumTextStyle( textFontSize: 15.0 )
                              : mediumTextWithoutColorStyle( textFontSize: 15.0 ),
                          ),
                          const SizedBox(height: 8.0),
                          Row(
                            children: [
                              Text(
                                BenekStringHelpers.getStringWithCharacterLimit(
                                    "$petKind | ${BenekStringHelpers.calculateYearsDifference(widget.resultData.birthDay!)} ${BenekStringHelpers.locale('yearsOld')} | ${BenekStringHelpers.getPetGenderAsString(widget.resultData.sex!)}", 80),
                                style: isHovering
                                  ? lightTextStyle( textFontSize: 15.0 )
                                  : lightTextWithoutColorStyle( textFontSize: 15.0 ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Text(
                        widget.resultData.bio != null ? BenekStringHelpers.getStringWithCharacterLimit(widget.resultData.bio!, 50) : "",
                        style: isHovering
                          ? regularTextStyle( textFontSize: 12.0 )
                          : regularTextWithoutColorStyle( textFontSize: 12.0 ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8.0),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: 150,
                      height: 35,
                      child: StoryFirstFiveLikedUserStackedWidget(
                        isCentered: false,
                        totalLikeCount: widget.resultData.allOwners!.length,
                        users: widget.resultData.allOwners!,
                        backgroundColor: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                        borderWidth: 4.0,
                      ),
                    ),

                     Padding(
                       padding: const EdgeInsets.symmetric(horizontal: 10.0),
                       child: Container(
                        width: 2.0,
                        height: 35.0,
                        decoration: BoxDecoration(
                          color: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(6.0),
                            bottomLeft: Radius.circular(6.0),
                          ),
                        ),
                                           ),
                     ),

                    BenekCircleAvatar(
                      imageUrl: widget.resultData.primaryOwner!.profileImg!.imgUrl!,
                      width: 35.0,
                      height: 35.0,
                      radius: 100.0,
                      isDefaultAvatar: widget.resultData.primaryOwner!.profileImg!.isDefaultImg!,
                      bgColor: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}