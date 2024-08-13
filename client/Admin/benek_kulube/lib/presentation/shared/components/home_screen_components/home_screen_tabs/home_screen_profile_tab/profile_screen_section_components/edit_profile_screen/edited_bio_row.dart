import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import 'edit_bio_button.dart';
import 'edit_text_screen.dart';

class EditedBioRow extends StatefulWidget {
  final String bio;
  const EditedBioRow({
    super.key,
    required this.bio,
  });

  @override
  State<EditedBioRow> createState() => _EditedBioRowState();
}

class _EditedBioRowState extends State<EditedBioRow> {
  late String bioToDisplay;

  @override
  void initState() {
    super.initState();
    bioToDisplay = widget.bio;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Stack(
          children: [
            Container(
              width: 680,
              decoration: const BoxDecoration(
                color: AppColors.benekBlack,
                borderRadius: BorderRadius.all(Radius.circular(6.0)),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 35.0),
                child: Center(
                  child: Wrap(
                    children: [
                      Text(
                        bioToDisplay,
                        textAlign: TextAlign.center,
                        style: planeTextWithoutWeightStyle(
                          textColor: AppColors.benekWhite,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              top: 0,
              left: 0,
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(6.0),
                ),
                child: EditBioButton(
                  onTap: () async {

                    String? newBio = await Navigator.push(
                      context,
                      PageRouteBuilder(
                        opaque: false,
                        barrierDismissible: false,
                        pageBuilder: (context, _, __) => EditTextScreen( textToEdit: widget.bio, ),
                      ),
                    );

                    if(newBio == null)return;

                    setState(() {
                      bioToDisplay = newBio;
                    });
                  },
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
