import 'package:benek_kulube/common/widgets/story_context_component/story_context_widget.dart';
import 'package:benek_kulube/common/widgets/vertical_video_companent/vertical_video_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../data/models/story_models/story_model.dart';

class StoryContextVerticalScrollWidget extends StatefulWidget {
  final int activePageIndex;
  final List<StoryModel> storiesToDisplay;
  final double width;
  final double height;

  const StoryContextVerticalScrollWidget({
    super.key,
    required this.activePageIndex,
    required this.storiesToDisplay,
    required this.width,
    required this.height
  });

  @override
  State<StoryContextVerticalScrollWidget> createState() => _StoryContextVerticalScrollWidgetState();
}

class _StoryContextVerticalScrollWidgetState extends State<StoryContextVerticalScrollWidget> {
  late PageController _controller;

  @override
  void initState() {
    super.initState();

    _controller = PageController(initialPage: widget.activePageIndex);
  }

  @override
  void didUpdateWidget(StoryContextVerticalScrollWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.activePageIndex != oldWidget.activePageIndex) {
      _controller.animateToPage(
        widget.activePageIndex,
        duration: const Duration(milliseconds: 700),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Center(
        child: SizedBox(
          width: widget.width,
          height: widget.height,
          child: PageView.builder(
            controller: _controller,
            physics: const NeverScrollableScrollPhysics(),
            scrollDirection: Axis.vertical,
            itemCount: widget.storiesToDisplay.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: EdgeInsets.only( bottom: index != widget.storiesToDisplay.length - 1 ? 15.0 : 0.0),
                child: Container(
                  width: widget.width,
                  height: widget.height,
                  child: StoryContextWidget(
                    story: widget.storiesToDisplay[index],
                  )
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
