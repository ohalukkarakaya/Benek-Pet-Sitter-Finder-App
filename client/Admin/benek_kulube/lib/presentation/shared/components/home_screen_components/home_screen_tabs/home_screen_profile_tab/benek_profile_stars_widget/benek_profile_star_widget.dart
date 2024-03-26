import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/benek_icons.dart';

class BenekProfileStarWidget extends StatelessWidget {
  final int star;
  final int starCount;
  const BenekProfileStarWidget({
    super.key,
    this.star = 0,
    this.starCount = 0
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        color: AppColors.benekBlack.withOpacity(0.2),
        borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
                  5,
                  (index){
                    return Padding(
                      padding: const EdgeInsets.all(5.0),
                      child: Icon(
                        Icons.star,
                        color: index < star
                            ? AppColors.benekWhite
                            : AppColors.benekBlack,
                        size: 20,
                      ),
                    );
                  }
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(5.0),
            child: Text(
              "| $starCount",
              style: const TextStyle(
                fontFamily: 'Qanelas',
                fontSize: 15,
                color: AppColors.benekWhite
              ),
            ),
          ),
        ],
      ),
    );
  }
}
