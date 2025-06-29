import 'package:benek/common/constants/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_state.dart';
import 'package:benek/common/widgets/vertical_video_companent/vertical_video_widget.dart';
import 'package:benek/common/widgets/story_context_component/story_context_widget.dart';

class StoryWatchScreen extends StatefulWidget {
  const StoryWatchScreen({super.key});

  @override
  State<StoryWatchScreen> createState() => _StoryWatchScreenState();
}

class _StoryWatchScreenState extends State<StoryWatchScreen> {
  late PageController _pageController;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    final store = StoreProvider.of<AppState>(context, listen: false);
    _pageController = PageController(initialPage: store.state.storiesToDisplay?.indexWhere(
          (story) => story.storyId == store.state.selectedStory?.storyId,
        ) ?? 0);
    _focusNode.requestFocus();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final store = StoreProvider.of<AppState>(context);
    final stories = store.state.storiesToDisplay ?? [];

    return Scaffold(
      backgroundColor: Colors.black,
      body: KeyboardListener(
        focusNode: _focusNode,
        onKeyEvent: (event) {
          if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
            Navigator.of(context).pop();
          }
        },
        child: PageView.builder(
          controller: _pageController,
          scrollDirection: Axis.vertical,
          itemCount: stories.length,
          onPageChanged: (index) async {
            await store.dispatch(selectStoryAction(stories[index]));
            await store.dispatch(getStoryCommentsByStoryIdRequestAction(stories[index].storyId!, null));
          },
          itemBuilder: (context, index) {
            final story = stories[index];

            return Stack(
              children: [
                VerticalContentComponent(
                  src: story.contentUrl!,
                  user: story.user!,
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height,
                ),
                Positioned(
                  bottom: 40,
                  right: 20,
                  child: IconButton(
                    icon: const Icon(Icons.more_vert, color: Colors.white, size: 28),
                    onPressed: () {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (context) => DraggableScrollableSheet(
                          initialChildSize: 0.7,
                          minChildSize: 0.3,
                          maxChildSize: 0.9,
                          builder: (context, scrollController) {
                            return Container(
                              decoration: BoxDecoration(
                                color: AppColors.benekBlack.withAlpha((0.8 * 255).toInt()),
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              child: SingleChildScrollView(
                                controller: scrollController,
                                child: StoryContextWidget(
                                  story: story,
                                  closeFunction: () {
                                    Navigator.of(context).pop();
                                  },
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}