import 'dart:developer';

import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/benek_small_button.dart';
import 'package:benek_kulube/data/services/google_services/google_maps_helpers.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_location_model.dart';
import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/widgets/benek_horizontal_button.dart';
import '../../../../../../../common/widgets/copy_button.dart';

class ProfileAdressWidget extends StatelessWidget {
  final String? openAdress;
  final UserLocation? location;
  const ProfileAdressWidget({
    Key? key,
    required this.openAdress,
    required this.location,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return location == null || openAdress == null
        ? Shimmer.fromColors(
          baseColor: AppColors.benekBlack.withOpacity(0.5),
          highlightColor: AppColors.benekBlack.withOpacity(0.2),
          child: Container(
            width: 150,
            height: 200,
            decoration: BoxDecoration(
              color: AppColors.benekBlack.withOpacity(0.5),
              borderRadius: const BorderRadius.all(Radius.circular(6.0)),
            ),
          ),
        )
        : Container(
          height: 200,
          width: 320,
          padding: const EdgeInsets.only(
              left: 16.0,
              top: 16.0,
              bottom: 16.0,
              right: 16.0,
          ),
          decoration: BoxDecoration(
            color: AppColors.benekBlack.withOpacity(0.2),
            borderRadius: const BorderRadius.all(Radius.circular(6.0)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "${location!.country} / ${location!.city}",
                    style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 12.0,
                      color: AppColors.benekWhite,
                      fontWeight: FontWeight.w500,
                    ),
                  ),

                  BenekCopyButton( valueToCopy: openAdress ?? "",),
                ],
              ),
              Wrap(
                children: [
                  Text(
                    openAdress ?? "",
                    style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 12.0,
                      color: AppColors.benekWhite,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ]
              ),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  BenekSmallButton(
                    iconData: BenekIcons.compass,
                    tooltipMessage: BenekStringHelpers.locale('copied'),
                    onTap: () async { Clipboard.setData(ClipboardData(text: '${location!.lat},${location!.lng}')); },
                  ),
                  BenekHorizontalButton(
                    text: BenekStringHelpers.locale('showOnMap'),
                    onTap: () async {
                      if( location != null ){
                        await GoogleMapsHelpers.launchMap(location!.lat!, location!.lng!);
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
        );
  }
}