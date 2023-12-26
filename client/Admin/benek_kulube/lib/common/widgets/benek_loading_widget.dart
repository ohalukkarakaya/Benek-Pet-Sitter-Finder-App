import 'package:benek_kulube/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:benek_kulube/presentation/shared/components/loading_components/benek_loading_component.dart';
import 'package:flutter/material.dart';

class BenekLoadingWidget extends StatelessWidget {
  const BenekLoadingWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const BenekBluredModalBarier(
      child: Center(
        child: BenekLoadingComponent(),
      )
    );
  }
}