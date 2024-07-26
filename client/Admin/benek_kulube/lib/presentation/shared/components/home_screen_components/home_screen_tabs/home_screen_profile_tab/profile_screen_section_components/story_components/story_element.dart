import 'package:benek_kulube/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/story_watch_screen.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../data/models/story_models/story_model.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

class StoryElement extends StatelessWidget {
  final void Function(dynamic Function() selectStoryFunction, List<StoryModel>? stories, int index) onTapPageBuilder;
  final int index;
  final List<StoryModel>? stories;
  final StoryModel? story;
  const StoryElement({
    super.key,
    required this.onTapPageBuilder,
    required this.index,
    this.stories,
    this.story
  });

  void _onTap(BuildContext context, dynamic Function() selectStoryFunction) async {

    if( story != null ){
      await selectStoryFunction();
    }

    await Navigator.push(
      context,
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: false,
        pageBuilder: (context, _, __) => const StoryWatchScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {

    const Size containerSize = Size(125, 250);
    Store<AppState> store = StoreProvider.of<AppState>(context);

    return GestureDetector(
      onTap: () => onTapPageBuilder(() => store.dispatch(selectStoryAction(story!)), stories, index),
      child: Padding(
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
                        AppColors.benekBlack.withOpacity(1),
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
                        SizedBox(
                          width: 75,
                          child: Text(
                            story!.about!.pet!.name!,
                            style: const TextStyle(
                                fontFamily: 'Qanelas',
                                fontSize: 12.0,
                                fontWeight: FontWeight.w500
                            ),
                            overflow: TextOverflow.fade,
                          ),
                        ),
                      ],
                    ),
                  )
                : const SizedBox(),
              ],
            ),
          )
      ),
    );;
  }
}
