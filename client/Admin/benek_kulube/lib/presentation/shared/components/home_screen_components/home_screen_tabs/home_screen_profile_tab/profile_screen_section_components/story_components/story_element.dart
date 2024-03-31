import 'package:benek_kulube/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../data/models/story_models/story_model.dart';

class StoryElement extends StatelessWidget {
  final StoryModel? story;
  const StoryElement({
    super.key,
    this.story
  });

  @override
  Widget build(BuildContext context) {

    const Size containerSize = Size(125, 250);

    return Padding(
        padding: const EdgeInsets.all( 8.0 ),
        child: ClipRRect(
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          child: Stack(
            children: [
              SizedBox(
                width: containerSize.width,
                height: containerSize.height,
                child: story != null
                  && story!.contentUrl != null
                    ? ImageVideoHelpers.getThumbnail( story!.contentUrl! )
                    : const SizedBox(),
              ),

              Container(
                width: containerSize.width,
                height: containerSize.height,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      AppColors.benekBlack,
                      AppColors.benekBlack.withOpacity(0.0),
                    ],
                  ),
                ),
              ),

              story != null
              && story!.about != null
              && story!.about!.pet != null
              ? Positioned(
                  left: 7,
                  bottom: 7,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      BenekCircleAvatar(
                          width: 20,
                          height: 20,
                          borderWidth: 2.0,
                          isDefaultAvatar: story!.about!.pet!.petProfileImg!.isDefaultImg!,
                          imageUrl: story!.about!.pet!.petProfileImg!.imgUrl!
                      ),
                      const SizedBox(width: 5,),
                      Text(
                        story!.about!.pet!.name!,
                        style: const TextStyle(
                            fontFamily: 'Qanelas',
                            fontSize: 12.0,
                            fontWeight: FontWeight.w500
                        ),
                      ),
                    ],
                  ),
                )
              : const SizedBox(),
            ],
          ),
        )
    );;
  }
}
