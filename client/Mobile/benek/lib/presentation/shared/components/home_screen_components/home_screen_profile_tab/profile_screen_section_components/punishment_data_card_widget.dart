import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';

import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../data/models/chat_models/punishment_model.dart';

class PunishmentCardWidget extends StatelessWidget {
  final PunishmentModel punishment;

  const PunishmentCardWidget({
    Key? key,
    required this.punishment
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final admin = punishment.admin!;
    final formattedDate = BenekStringHelpers.getDateAsString(punishment.date!);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.benekBlack,
          borderRadius: BorderRadius.all(Radius.circular(8.0)),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BenekCircleAvatar(
              imageUrl: admin.profileImg?.imgUrl ?? '',
              width: 40.0,
              height: 40.0,
              isDefaultAvatar: admin.profileImg?.isDefaultImg ?? true,
              bgColor: AppColors.benekWhite,
              borderWidth: 2.0,
            ),
            const SizedBox(width: 12.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            admin.userName ?? 'Bilinmeyen',
                            style: semiBoldTextWithoutColorStyle().copyWith(
                              color: AppColors.benekWhite,
                              fontSize: 14.0,
                            ),
                          ),
                          const SizedBox(height: 4.0),
                          Text(
                            BenekStringHelpers.getUsersFullName(admin.identity!.firstName!, admin.identity!.lastName!, admin.identity!.middleName),
                            style: semiBoldTextWithoutColorStyle().copyWith(
                              color: AppColors.benekGrey,
                              fontSize: 10.0,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        formattedDate,
                        style: regularTextWithoutColorStyle().copyWith(
                          color: AppColors.benekGrey,
                          fontSize: 8.0,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 15.0),
                  Text(
                    punishment.adminDesc ?? '',
                    style: regularTextWithoutColorStyle().copyWith(
                      color: AppColors.benekWhite,
                      fontSize: 10.0,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}