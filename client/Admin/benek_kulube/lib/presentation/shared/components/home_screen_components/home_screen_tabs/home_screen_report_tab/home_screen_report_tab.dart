import 'package:benek_kulube/data/models/care_give_models/report_state_model.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../../store/actions/app_actions.dart';
import '../../../../../../common/widgets/vertical_video_companent/vertical_video_widget.dart';
import '../../../../../../common/widgets/vertical_video_companent/video_loading_widget.dart';
import '../../../../../../data/models/care_give_models/report_model.dart';
import '../../../../../../store/app_redux_store.dart';

class KulubeReportTabWidget extends StatefulWidget {
  const KulubeReportTabWidget({super.key});

  @override
  State<KulubeReportTabWidget> createState() => _KulubeReportTabWidgetState();
}

class _KulubeReportTabWidgetState extends State<KulubeReportTabWidget> {

  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = StoreProvider.of<AppState>(context);
      await store.dispatch(getReportedMissionListAction());
    });
  }

  @override
  void dispose() {
    super.dispose();
    _pageController.dispose();
    Store<AppState> store = AppReduxStore.currentStore!;
    store.dispatch(resetReportsAction());
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    return StoreConnector<AppState, ReportStateModel?>(
        converter: (store) => store.state.reports,
        builder: (context, reportState) {

        final reports = reportState?.reports;

          return Padding(
            padding: const EdgeInsets.only(top: 30),
            child: Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  // Sol: Video tarafı
                  Padding(
                    padding: const EdgeInsets.only(left: 40.0),
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height - 150,
                      width: MediaQuery.of(context).size.width / 3,
                      child: reports == null || reports.isEmpty
                          ? ClipRRect(
                            borderRadius: BorderRadius.circular(25.0),
                            child: Container(
                              color: Colors.white,
                              child: VideoLoadingWidget(
                                width: MediaQuery.of(context).size.width / 3,
                                height: MediaQuery.of(context).size.height - 100,
                              ),
                            ),
                          )
                          : PageView.builder(
                            scrollDirection: Axis.vertical,
                            itemCount: reports.length,
                            controller: _pageController,
                            onPageChanged: (index) async {
                              await store.dispatch(setSelectedReportIndex(index));

                              final reportCount = reportState?.reports?.length ?? 0;
                              final total = reportState?.totalReportCount ?? 0;

                              // Son iki elemana gelindiyse yeni veri çek
                              if (index >= reportCount - 2 && reportCount < total) {
                                await store.dispatch(getReportedMissionListAction());
                              }
                            },
                            itemBuilder: (context, index) {
                              final report = reports[index];
                              final videoUrl = report.mission?.content?.videoUrl;

                              return Padding(
                                padding: EdgeInsets.only( bottom: index != reports.length - 1 ? 15.0 : 0.0),
                                child: VerticalContentComponent(
                                  src: videoUrl ?? '',
                                  user: report.mission!.careGiver!,
                                  width: MediaQuery.of(context).size.width / 3,
                                  height: MediaQuery.of(context).size.height - 100,
                                ),
                              );
                            },
                          ),
                    ),
                  )
                ],
              )
            ),
          );
        }
    );
  }
}
