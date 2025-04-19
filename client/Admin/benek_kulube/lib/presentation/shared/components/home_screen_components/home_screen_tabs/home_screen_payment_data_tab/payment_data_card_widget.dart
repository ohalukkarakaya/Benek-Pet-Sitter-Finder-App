import 'package:flutter/material.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';


import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/styles.text.dart';
import '../../../../../../data/models/payment_data_models/payment_data_model.dart';
import '../../../benek_circle_avatar/benek_circle_avatar.dart';

class PaymentDataCardWidget extends StatelessWidget {
  final PaymentDataModel payment;

  const PaymentDataCardWidget({
    super.key,
    required this.payment,
  });

  @override
  Widget build(BuildContext context) {
    final caregiver = payment.careGiver!;
    final petOwner = payment.petOwner!;

    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.benekBlack.withOpacity(0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    BenekStringHelpers.locale('careGiver'),
                    style: semiBoldTextStyle(
                      textColor: AppColors.benekWhite,
                      textFontSize: 10.0,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only( bottom: 5.0),
                        child: BenekCircleAvatar(
                          isDefaultAvatar: caregiver.profileImg!.isDefaultImg!,
                          imageUrl: caregiver.profileImg!.imgUrl!,
                          width: 35,
                          height: 35,
                          borderWidth: 2,
                        ),
                      ),
                      const SizedBox(width: 12.0),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            BenekStringHelpers.getUsersFullName(caregiver.identity!.firstName!, caregiver.identity!.lastName!, caregiver.identity!.middleName),
                            style: semiBoldTextStyle(
                              textColor: AppColors.benekWhite,
                              textFontSize: 12.0,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Text(
                                "ID No: ",
                                style: regularTextStyle(
                                  textColor: AppColors.benekWhite,
                                  textFontSize: 11.0,
                                ),
                              ),
                              Text(
                                caregiver.identity!.nationalIdentityNumber!,
                                style: regularTextStyle(
                                  textColor: AppColors.benekGrey,
                                  textFontSize: 11.0,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    BenekStringHelpers.locale('customer'),
                    style: semiBoldTextStyle(
                      textColor: AppColors.benekWhite,
                      textFontSize: 10.0,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only( bottom: 5.0),
                        child: BenekCircleAvatar(
                          isDefaultAvatar: petOwner.profileImg!.isDefaultImg!,
                          imageUrl: petOwner.profileImg!.imgUrl!,
                          width: 35,
                          height: 35,
                          borderWidth: 2,
                        ),
                      ),
                      const SizedBox(width: 12.0),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            BenekStringHelpers.getUsersFullName(petOwner.identity!.firstName!, petOwner.identity!.lastName!, petOwner.identity!.middleName),
                            style: semiBoldTextStyle(
                              textColor: AppColors.benekWhite,
                              textFontSize: 12.0,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            petOwner.email!,
                            style: regularTextStyle(
                              textColor: AppColors.benekGrey,
                              textFontSize: 11.0,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    payment.amount.toString(),
                    style: boldTextStyle(
                        textColor: AppColors.benekLightBlue, textFontSize: 16
                    )
                  ),
                  const SizedBox(height: 4),
                  Text(
                    BenekStringHelpers.getDateAsString(payment.date!),
                    style: regularTextStyle(
                        textColor: AppColors.benekGrey,
                        textFontSize: 12
                    )
                  ),
                ],
              )
            ],
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: '${BenekStringHelpers.locale('careGiverAdress')}  ',
                        style: regularTextStyle(
                          textColor: AppColors.benekGrey,
                          textFontSize: 12.0,
                        ),
                      ),
                      TextSpan(
                        text: caregiver.identity?.openAdress ?? '—',
                        style: semiBoldTextStyle(
                          textColor: AppColors.benekWhite,
                          textFontSize: 12.0,
                        ),
                      ),
                    ],
                  ),
                  softWrap: true,
                  maxLines: null,
                  overflow: TextOverflow.visible,
                ),
              ),
            ],
          )

        ],
      ),
    );
  }
}
