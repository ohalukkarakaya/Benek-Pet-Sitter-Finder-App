import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/presentation/shared/components/benek_dashed_border/benek_dashed_border.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek/store/app_state.dart';
import 'package:benek/store/actions/app_actions.dart';
import '../edit_text_screen.dart';
import '../../../../../../../../../common/constants/app_colors.dart';

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
    final store = StoreProvider.of<AppState>(context);

    return MouseRegion(
      cursor: widget.didEdit ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onEnter: (_) => setState(() => didHovered = true),
      onExit: (_) => setState(() => didHovered = false),
      child: GestureDetector(
        onTap: () async {
          if (!widget.didEdit) return;

          String? changes = await Navigator.push(
            context,
            PageRouteBuilder(
              opaque: false,
              barrierDismissible: false,
              pageBuilder: (context, _, __) => EditTextScreen(
                textToEdit: widget.address ?? '',
                onDispatch: (text) async {
                  await store.dispatch(updateAddressRequestAction(
                    'TUR',
                    widget.city!,
                    text,
                    widget.lat!,
                    widget.lng!,
                  ));
                },
              ),
            ),
          );

          if (changes != null) {
            Navigator.pop(context);
          }
        },
        child: Container(
          width: double.infinity,
          height: 55.0,
          padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
          decoration: BoxDecoration(
            color: !didHovered || !widget.didEdit
                ? AppColors.benekBlack.withOpacity(0.8)
                : AppColors.benekLightGreen,
            borderRadius: BorderRadius.circular(6.0),
          ),
          child: BenekDottedBorder(
            color: !widget.didEdit
                ? AppColors.benekGrey
                : !didHovered
                    ? AppColors.benekWhite
                    : AppColors.benekSuccessGreen,
            strokeWidth: 2,
            borderType: BorderType.RRect,
            radius: const Radius.circular(4.0),
            child: Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.check,
                    color: !widget.didEdit
                        ? AppColors.benekGrey
                        : !didHovered
                            ? AppColors.benekWhite
                            : AppColors.benekSuccessGreen,
                    size: 24.0,
                  ),
                  const SizedBox(width: 10.0),
                  Text(
                    BenekStringHelpers.locale('save'),
                    style: boldTextStyle(
                      textColor: !widget.didEdit
                          ? AppColors.benekGrey
                          : !didHovered
                              ? AppColors.benekWhite
                              : AppColors.benekSuccessGreen,
                      textFontSize: 16.0,
                    ),
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