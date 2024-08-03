import 'dart:developer';

import 'package:benek_kulube/data/models/story_models/story_model.dart';
import 'package:benek_kulube/redux/get_story_comments/get_story_comments_by_story_id.action.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/widgets/story_context_component/story_context_vertical_scroll_widget.dart';
import '../../../../../../../../common/widgets/vertical_video_companent/vertical_scroll_widget.dart';
import '../../../../../loading_components/benek_blured_modal_barier.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

class StoryWatchScreen extends StatefulWidget {
  const StoryWatchScreen({super.key});

  @override
  State<StoryWatchScreen> createState() => _StoryWatchScreenState();
}

class _StoryWatchScreenState extends State<StoryWatchScreen> {
  final FocusNode _storyWatchFocusNode = FocusNode();

  bool shouldPop = false;

  @override
  void initState() {
    super.initState();
    _storyWatchFocusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {

    final Store<AppState> store = StoreProvider.of<AppState>(context);

    if( shouldPop ){
      setState(() {
        shouldPop = false;
      });
      Navigator.pop(context);
    }

    int selectedStoryIndex = store.state.selectedStory != null && store.state.storiesToDisplay != null
        ? store.state.storiesToDisplay!.indexWhere((StoryModel story) => story.storyId == store.state.selectedStory!.storyId)
        : 0;

    return BenekBluredModalBarier(
      isDismissible: false,
      child: KeyboardListener(
        focusNode: _storyWatchFocusNode,
        onKeyEvent: (KeyEvent event){
          if(
            event is KeyDownEvent
            && event.logicalKey == LogicalKeyboardKey.escape
          ){
            setState(() {
              shouldPop = true;
            });
          }
        },
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Padding(
            padding: const EdgeInsets.only(right: 40.0),
            child: Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 40.0),
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height - 100,
                      width: MediaQuery.of(context).size.width / 3,
                      child: VerticalScrollWidget(
                          height: MediaQuery.of(context).size.height - 100,
                          width: MediaQuery.of(context).size.width / 3,
                          startFrom: selectedStoryIndex,
                          storiesToDisplay: store.state.storiesToDisplay!,
                          onStoryChange: (int index) {
                            store.dispatch(getStoryCommentsByStoryIdRequestAction(store.state.storiesToDisplay![index].storyId, null));
                            setState(() {
                              selectedStoryIndex = index;
                            });
                          },
                      ),
                    ),
                  ),

                  SizedBox(
                    height: MediaQuery.of(context).size.height - 100,
                    width: MediaQuery.of(context).size.width / 3,
                    child: StoryContextVerticalScrollWidget(
                      activePageIndex: selectedStoryIndex,
                      storiesToDisplay: store.state.storiesToDisplay!,
                      width: MediaQuery.of(context).size.width / 3,
                      height: MediaQuery.of(context).size.height - 100,
                      closeFunction: () {
                        setState(() {
                          shouldPop = true;
                        });
                      },
                    )
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
