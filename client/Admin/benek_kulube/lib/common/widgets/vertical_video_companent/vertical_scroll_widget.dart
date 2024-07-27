import 'dart:developer';

import 'package:benek_kulube/common/widgets/vertical_video_companent/vertical_video_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../data/models/story_models/story_model.dart';

class VerticalScrollWidget extends StatefulWidget {
  final int startFrom;
  final List<StoryModel> storiesToDisplay;
  final Function(int index)? onStoryChange;
  final double width;
  final double height;

  const VerticalScrollWidget({
    super.key,
    this.startFrom = 0,
    required this.storiesToDisplay,
    this.onStoryChange,
    required this.width,
    required this.height
  });

  @override
  State<VerticalScrollWidget> createState() => _VerticalScrollWidgetState();
}

class _VerticalScrollWidgetState extends State<VerticalScrollWidget> {
  late PageController controller;

  @override
  void initState() {
    super.initState();

    controller = PageController(initialPage: widget.startFrom);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    List<String> contentUrlList = widget.storiesToDisplay.map((StoryModel story) => story.contentUrl!).toList();

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Center(
        child: SizedBox(
          width: widget.width,
          height: widget.height,
          child: PageView.builder(
            controller: controller,
            scrollDirection: Axis.vertical,
            itemCount: contentUrlList.length,
            onPageChanged: (int currentPage) {
              if(widget.onStoryChange != null) {
                widget.onStoryChange!(currentPage);
              }
              _handlePageChange(currentPage);
            },
            itemBuilder: (context, index) {
              return Padding(
                padding: EdgeInsets.only( bottom: index != contentUrlList.length - 1 ? 15.0 : 0.0),
                child: VerticalContentComponent(
                    src: contentUrlList[index],
                    user: widget.storiesToDisplay[index].user!,
                    width: widget.width,
                    height: widget.height
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  void _handlePageChange(int currentPage) {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    store.dispatch(selectStoryAction(store.state.storiesToDisplay![currentPage]));
  }
}
