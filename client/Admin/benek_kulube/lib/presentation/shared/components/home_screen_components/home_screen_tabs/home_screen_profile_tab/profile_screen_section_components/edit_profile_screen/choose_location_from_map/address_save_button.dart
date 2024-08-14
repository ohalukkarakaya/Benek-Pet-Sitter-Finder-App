import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../benek_dashed_border/benek_dashed_border.dart';
import '../edit_text_screen.dart';

class AddressSaveButton extends StatefulWidget {
  final bool didEdit;
  final String? address;
  final String? city;
  final double? lat;
  final double? lng;

  const AddressSaveButton({
    super.key,
    required this.didEdit,
    required this.address,
    required this.city,
    required this.lat,
    required this.lng,
  });

  @override
  State<AddressSaveButton> createState() => _AddressSaveButtonState();
}

class _AddressSaveButtonState extends State<AddressSaveButton> {
  bool didHovered = false;

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    return MouseRegion(
      cursor: widget.didEdit ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onEnter: (_) {
        setState(() {
          didHovered = true;
        });
      },
      onExit: (_) {
        setState(() {
          didHovered = false;
        });
      },
      child: GestureDetector(
        onTap: () async {
          String? changes = widget.didEdit
              ? await Navigator.push(
                context,
                PageRouteBuilder(
                  opaque: false,
                  barrierDismissible: false,
                  pageBuilder: (context, _, __) => EditTextScreen(
                      textToEdit: widget.address!,
                      onDispatch: (text) => store.dispatch(updateAddressRequestAction('TUR', widget.city!, text, widget.lat!, widget.lng!)),
                  ),
                ),
              )
              : null;

          if (changes != null) {
            Navigator.pop(context);
          }
        },
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Container(
            width: 187.0,
            height: 60.0,
            alignment: Alignment.bottomLeft,
            padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
            decoration: BoxDecoration(
              color: !didHovered || !widget.didEdit ? AppColors.benekBlack.withOpacity(0.8) : AppColors.benekLightGreen,
              borderRadius: BorderRadius.all(Radius.circular(6.0)),
            ),
            child: BenekDottedBorder(
              color: !widget.didEdit
                ? AppColors.benekGrey
                : !didHovered
                  ? AppColors.benekWhite
                  : AppColors.benekSuccessGreen,
              strokeWidth: 2,
              borderType: BorderType.RRect,
              radius: const Radius.circular(2.0),
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.check,
                      color: !widget.didEdit
                        ? AppColors.benekGrey
                        : !didHovered
                            ? AppColors.benekWhite
                            : AppColors.benekSuccessGreen,
                      size: 25.0,
                    ),

                    const SizedBox(width: 15.0),

                    Text(
                        BenekStringHelpers.locale('save'),
                      style: boldTextStyle(
                        textColor: !widget.didEdit
                            ? AppColors.benekGrey
                            : !didHovered
                                ? AppColors.benekWhite
                                : AppColors.benekSuccessGreen,
                        textFontSize: 15.0,
                      )
                    )
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
