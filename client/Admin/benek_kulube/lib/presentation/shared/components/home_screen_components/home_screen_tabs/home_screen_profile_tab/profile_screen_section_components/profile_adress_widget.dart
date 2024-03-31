import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_location_model.dart';
import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:shimmer/shimmer.dart';

class ProfileAdressWidget extends StatelessWidget {
  final UserLocation? location;
  const ProfileAdressWidget({
    Key? key,
    required this.location,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return location == null
        ? Shimmer.fromColors(
          baseColor: AppColors.benekBlack.withOpacity(0.5),
          highlightColor: AppColors.benekBlack.withOpacity(0.2),
          child: Container(
            width: 150,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.benekBlack.withOpacity(0.5),
              borderRadius: const BorderRadius.all(Radius.circular(6.0)),
            ),
          ),
        )
        : Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: AppColors.benekBlack.withOpacity(0.2),
            borderRadius: const BorderRadius.all(Radius.circular(6.0)),
          ),
          child: Text(
            "${location!.country} / ${location!.city}",
            style: const TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 12.0,
              color: AppColors.benekWhite,
              fontWeight: FontWeight.w500,
            ),
          ),
        );
  }
}