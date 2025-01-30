
import 'package:benek_kulube/data/models/pet_models/pet_image_model.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';

class PetImagesWidget extends StatefulWidget {
  final List<PetImageModel>? images;

  const PetImagesWidget({
    super.key,
    this.images,
  });

  @override
  State<PetImagesWidget> createState() => _PetImagesWidgetState();
}

class _PetImagesWidgetState extends State<PetImagesWidget> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only( top: 20.0),
      child: Container(
        width: 540,
        padding: const EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          color: AppColors.benekBlack.withOpacity(0.2),
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3, // 3 sütun
            crossAxisSpacing: 10, // Sütunlar arası boşluk
            mainAxisSpacing: 10, // Satırlar arası boşluk
            childAspectRatio: 1, // Kare görünümü
          ),
          itemCount: 6, // 3x2 = 6 kare
          itemBuilder: (context, index) {
            return Container(
              decoration: BoxDecoration(
                color: Colors.blueAccent,
                borderRadius: BorderRadius.circular( 6.0 ),
              ),
            );
          },
        ),
      ),
    );
  }
}
