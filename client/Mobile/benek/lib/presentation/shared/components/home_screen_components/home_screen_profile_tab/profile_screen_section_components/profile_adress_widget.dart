import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/common/widgets/benek_small_button.dart';
import 'package:benek/data/services/google_services/google_maps_helpers.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:benek/data/models/user_profile_models/user_location_model.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/widgets/benek_horizontal_button.dart';
import '../../../../../../../common/widgets/copy_button.dart';

class ProfileAdressWidget extends StatelessWidget {
  final bool isEdit;
  final Function()? onEdit;
  final String? openAdress;
  final bool isDark;
  final UserLocation? location;
  final double width;
  final double longButtonWidth;

  const ProfileAdressWidget({
    Key? key,
    this.isEdit = false,
    this.onEdit,
    required this.openAdress,
    this.isDark = false,
    required this.location,
    this.width = 320,
    this.longButtonWidth = 230,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        double calculatedWidth = constraints.maxWidth < width ? constraints.maxWidth : width;
        double calculatedLongButtonWidth = calculatedWidth < 250 ? calculatedWidth * 0.9 : longButtonWidth;

        return location == null || openAdress == null
            ? Shimmer.fromColors(
                baseColor: AppColors.benekBlack.withAlpha((0.4 * 255).toInt()),
                highlightColor: AppColors.benekBlack.withAlpha((0.2 * 255).toInt()),
                child: Container(
                  width: calculatedWidth,
                  height: 200,
                  decoration: BoxDecoration(
                    color: AppColors.benekBlack.withAlpha((0.5 * 255).toInt()),
                    borderRadius: const BorderRadius.all(Radius.circular(6.0)),
                  ),
                ),
              )
            : Container(
                height: 200,
                width: calculatedWidth,
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: !isDark ? AppColors.benekBlack.withAlpha((0.2 * 255).toInt()) : AppColors.benekBlack,
                  borderRadius: const BorderRadius.all(Radius.circular(6.0)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Flexible(
                          child: Text(
                            "${location!.country} / ${location!.city}",
                            style: mediumTextStyle(textColor: AppColors.benekWhite),
                          ),
                        ),
                        !isEdit
                            ? BenekCopyButton(
                                valueToCopy: openAdress ?? "",
                                isLight: isDark,
                              )
                            : const SizedBox(),
                      ],
                    ),
                    Wrap(
                      children: [
                        Text(
                          openAdress ?? "",
                          style: regularTextStyle(textColor: AppColors.benekWhite),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: BenekHorizontalButton(
                            text: !isEdit ? BenekStringHelpers.locale('map') : BenekStringHelpers.locale('edit'),
                            isLight: isDark,
                            onTap: isEdit
                                ? onEdit
                                : () async {
                                    if (location != null) {
                                      await GoogleMapsHelpers.launchMap(location!.lat!, location!.lng!);
                                    }
                                  },
                          ),
                        ),
                      ],
                    )

                  ],
                ),
              );
      },
    );
  }

}