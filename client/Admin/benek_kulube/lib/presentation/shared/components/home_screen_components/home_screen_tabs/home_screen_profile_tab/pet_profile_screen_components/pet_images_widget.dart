
import 'package:benek_kulube/data/models/pet_models/pet_image_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../features/image_video_helpers/image_video_helpers.dart';

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
            crossAxisCount: 3,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1,
          ),
          itemCount: widget.images != null ? widget.images!.length : 0,
          itemBuilder: (context, index) {
            return Container(
              decoration: BoxDecoration(
                color: Colors.blueAccent,
                borderRadius: BorderRadius.circular( 6.0 ),
                  image: DecorationImage(
                    image: NetworkImage(
                      widget.images != null && widget.images?[index] != null ? ImageVideoHelpers.getFullUrl(widget.images![index].imgUrl!) : "",
                      headers: { "private-key": dotenv.env['MEDIA_SERVER_API_KEY']! },
                    ),
                    fit: BoxFit.cover,
                  )
              ),
            );
          },
        ),
      ),
    );
  }
}
