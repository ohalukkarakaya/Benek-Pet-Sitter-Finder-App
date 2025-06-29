import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';


class PetTagInfoCard extends StatelessWidget {
  const PetTagInfoCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6.0),
        child: Container(
          width: double.infinity,
          height: 60,
          decoration: BoxDecoration(
            color: AppColors.benekLightBlue,
            borderRadius: BorderRadius.circular(6.0),
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
              Text(
                BenekStringHelpers.locale('tagPetInfoCaption'),
                style: mediumTextStyle(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
