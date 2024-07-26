import 'dart:ui';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/kulube_horizontal_listview_widget/kulube_horizontal_listview_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/story_element.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/story_watch_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

import '../../../../../../../../data/models/story_models/story_model.dart';
import '../../../../../../../../store/app_state.dart';
import 'package:redux/redux.dart';

class KulubeStoriesBoard extends StatelessWidget {
  final void Function(dynamic Function() selectStoryFunction, List<StoryModel>? stories, int index) onTapPageBuilder;
  const KulubeStoriesBoard({
    super.key,
    required this.onTapPageBuilder
  });

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, List<StoryModel>?>(
      converter: (Store<AppState> store) => store.state.storiesToDisplay,
      builder: (BuildContext context, List<StoryModel>? stories) {
        return KulubeHorizontalListViewWidget(
            isEmpty: stories != null && stories.isEmpty,
            emptyListMessage: BenekStringHelpers.locale('noStoryMessage'),
            shouldShowShimmer: stories == null,
            child: ListView.builder(
              shrinkWrap: true,
              physics: stories != null && stories.length >= 5
                  ? const BouncingScrollPhysics()
                  : const NeverScrollableScrollPhysics(),

              itemCount: stories != null && stories.isNotEmpty ? stories.length : 5,
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, index) {
                return StoryElement(
                    onTapPageBuilder: onTapPageBuilder,
                    index: index,
                    stories: stories,
                    story: stories != null && stories.isNotEmpty ? stories[index] : null
                );
              },
            ),
        );
      }
    );
  }
}
