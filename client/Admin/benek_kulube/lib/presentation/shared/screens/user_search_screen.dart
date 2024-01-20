import 'package:benek_kulube/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_bar/user_search_bar.dart';
import 'package:flutter/material.dart';

class KulubeUserSearchScreen extends StatelessWidget {
  const KulubeUserSearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () async {
        Navigator.pop(context);
      },
      child: const Padding(
        padding: EdgeInsets.only( right: 200.0, left: 200.0, top: 30.0),
        child: Hero(
          tag: 'user_search_text_field',
          child: UserSearchBarTextFieldWidget()
        )
      ),
    );
  }
}