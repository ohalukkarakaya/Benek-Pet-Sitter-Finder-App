import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/common/widgets/kulube_horizontal_listview_widget/kulube_horizontal_listview_widget.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../data/models/pet_models/pet_model.dart';

class BenekPetAvatarsHorizontalListView extends StatefulWidget {
  final List<dynamic>? pets;
  const BenekPetAvatarsHorizontalListView({
    super.key,
    required this.pets,
  });

  @override
  State<BenekPetAvatarsHorizontalListView> createState() => _BenekPetAvatarsHorizontalListViewState();
}

class _BenekPetAvatarsHorizontalListViewState extends State<BenekPetAvatarsHorizontalListView> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 250,
      height: 50,
      child: Container(
        height: 50,
        decoration: BoxDecoration(
          color: AppColors.benekBlackWithOpacity,
          borderRadius: BorderRadius.circular(6.0),
        ),
        child: KulubeHorizontalListViewWidget(
            isEmpty: widget.pets == null || widget.pets!.isEmpty,
            emptyListMessage: BenekStringHelpers.locale('noPetMessage'),
            shouldShowShimmer: widget.pets != null && widget.pets!.isEmpty && widget.pets![0] is! PetModel,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: widget.pets!.length,
              itemBuilder: (BuildContext context, int index) {
                final ElTooltipController _tooltipController = ElTooltipController();

                return widget.pets![index] is PetModel
                  ? Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 8.0),
                    child: Center(
                      child: ElTooltip(
                        controller: _tooltipController,
                        color: AppColors.benekBlack,
                        showModal: false,
                        showChildAboveOverlay: false,
                        position: ElTooltipPosition.bottomCenter,
                        content:  widget.pets != null && widget.pets![index] is PetModel && widget.pets![index].name != null
                            ? Text(
                                '@${widget.pets![index].name!}',
                                style: mediumTextStyle(
                                    textColor: AppColors.benekWhite,
                                    textFontSize: 15.0
                                )
                            )
                            : const SizedBox(),
                        child: MouseRegion(
                          onHover: (event) {
                            setState(() {
                                _tooltipController.show();
                            });
                          },
                          onExit: (event) {
                            setState(() {
                                _tooltipController.hide();
                            });
                          },
                          child: BenekCircleAvatar(
                            width: 35,
                            height: 35,
                            borderWidth: 2,
                            imageUrl: widget.pets![index].petProfileImg.imgUrl,
                            isDefaultAvatar: widget.pets![index].petProfileImg.isDefaultImg,
                          ),
                        ),
                      ),
                    ),
                  )
                  : Padding(
                    padding: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 8.0),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                    ),
                  );
              },
            )
        ),
      ),
    );
  }
}
