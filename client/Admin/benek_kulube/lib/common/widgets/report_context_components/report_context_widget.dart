import 'package:benek_kulube/common/widgets/report_context_components/mission_desc_widget.dart';
import 'package:benek_kulube/common/widgets/report_context_components/report_desc_widget.dart';
import 'package:benek_kulube/common/widgets/report_context_components/report_excuse_input_box_widget.dart';
import 'package:benek_kulube/data/models/care_give_models/report_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../utils/benek_string_helpers.dart';
import '../approve_screen.dart';

class ReportContextWidget extends StatefulWidget {
  final ReportModel report;

  const ReportContextWidget({
    super.key,
    required this.report,
  });

  @override
  State<ReportContextWidget> createState() => _ReportContextWidgetState();
}

class _ReportContextWidgetState extends State<ReportContextWidget> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Expanded(
          child: ScrollConfiguration(
            behavior: ScrollConfiguration.of(context).copyWith(
              scrollbars: false,
              overscroll: false,
              physics: const BouncingScrollPhysics(),
            ),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  MissionDescWidget(
                    missionDesc: widget.report.mission!.desc!,
                    petOwner: widget.report.mission!.petOwner!,
                    pet: widget.report.mission!.pet!,
                    missionDeadline: widget.report.mission!.deadLine!,
                    timeCode: widget.report.mission!.content!.timeCode!,
                  ),
                  const SizedBox(height: 20.0),
                  ReportDescWidget(
                    reportDesc: widget.report.desc!,
                    reportOwner: widget.report.reporter!,
                  ),
                  const SizedBox(height: 20.0),
                  ExcuseInputBoxWidget(
                    hintText: "Mazeret girin...",
                    onSend: (text) async {
                      final Store<AppState> store = StoreProvider.of<AppState>(context);

                      bool didApprove = await Navigator.push(
                        context,
                        PageRouteBuilder(
                          opaque: false,
                          barrierDismissible: false,
                          pageBuilder: (context, _, __) => ApproveScreen(title: BenekStringHelpers.locale('approveAcceptingReport')),
                        ),
                      );

                      if( didApprove ){
                        await store.dispatch(sendReportResponseAction(widget.report.reportId!, true, text));
                      }

                      print("Gönderilen mazeret: $text");
                    },
                    onCancel: () async {
                      final Store<AppState> store = StoreProvider.of<AppState>(context);

                      bool didApprove = await Navigator.push(
                        context,
                        PageRouteBuilder(
                          opaque: false,
                          barrierDismissible: false,
                          pageBuilder: (context, _, __) => ApproveScreen(title: BenekStringHelpers.locale('cancelReport')),
                        ),
                      );

                      if( didApprove ){
                        await store.dispatch(sendReportResponseAction(widget.report.reportId!, false, null));
                      }

                      print("Mazeret girme iptal edildi");
                    },
                  ),

                ],
              ),
            ),
          ),
        )
      ],
    );
  }
}
