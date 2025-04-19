import 'package:benek_kulube/common/utils/benek_toast_helper.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_payment_data_tab/payment_data_card_loading_component.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_payment_data_tab/payment_data_card_widget.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';

import '../../../../../../common/constants/app_colors.dart';
import '../../../../../../common/constants/benek_icons.dart';
import '../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../common/utils/excel_helper.dart';
import '../../../../../../data/models/payment_data_models/payment_satate_model.dart';
import '../home_screen_profile_tab/benek_profile_stars_widget/benek_profile_star_detail_info_card.dart';

class HomeScreenPaymentDataTab extends StatefulWidget {
  const HomeScreenPaymentDataTab({super.key});

  @override
  State<HomeScreenPaymentDataTab> createState() => _HomeScreenPaymentDataTabState();
}

class _HomeScreenPaymentDataTabState extends State<HomeScreenPaymentDataTab> {
  @override
  void initState() {
    super.initState();
    Store<AppState> store = AppReduxStore.currentStore!;
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await store.dispatch(getPaymentCountOnPoolAction());
      await store.dispatch(getPaymentDataListAction());
    });
  }

  @override
  void dispose() {
    Store<AppState> store = AppReduxStore.currentStore!;
    store.dispatch(resetPaymentDataListAction());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, PaymentStateModel?>(
      converter: (Store<AppState> store) => store.state.paymentData,
      builder: (context, paymentData) {
        final isLoading = paymentData == null
            || paymentData.payments == null
            || (paymentData.payments!.isEmpty && paymentData.totalMoneyOnPool != 0);

        final isEmpty = paymentData?.payments?.isEmpty ?? false;

        return ScrollConfiguration(
          behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 25.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // ⭐ Kârlılık, pay vs
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      BenekProfileStarDetailInfoCard(
                        icon: FontAwesomeIcons.bullseye,
                        title: BenekStringHelpers.locale('profit'),
                        value: paymentData?.profit?.toString() ?? '0',
                        width: 195,
                      ),
                      BenekProfileStarDetailInfoCard(
                        icon: FontAwesomeIcons.faceSmile,
                        title: BenekStringHelpers.locale('customersShare'),
                        value: paymentData?.customersShare?.toString() ?? '0',
                        width: 195,
                      ),
                      BenekProfileStarDetailInfoCard(
                        icon: FontAwesomeIcons.receipt,
                        title: BenekStringHelpers.locale('customersTax'),
                        value: paymentData?.customersTax?.toString() ?? '0',
                        width: 195,
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // 🔽 Excel butonu üstte
                  if (!isLoading && !isEmpty)
                    Align(
                      alignment: Alignment.centerLeft,
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          await generateStyledPaymentsExcel(paymentData.payments!);
                          BenekToastHelper.showSuccessToast(
                            BenekStringHelpers.locale('operationSucceeded'),
                            BenekStringHelpers.locale('excelExported'),
                            context
                          );
                        },
                        icon: const Icon(Icons.file_download, color: AppColors.benekBlack,),
                        label: Text(
                          BenekStringHelpers.locale('exportAsExcel'),
                          style: TextStyle(
                            color: AppColors.benekBlack,
                            fontSize: 14.0,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.benekLightBlue,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 35, vertical: 25),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                    ),

                  const SizedBox(height: 20),

                  // 🔽 Ödeme kartları
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.benekBlack.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(6.0),
                    ),
                    padding: const EdgeInsets.only(top: 20.0, left: 20.0, right: 20.0),
                    child: Column(
                      children: isLoading
                          ? List.generate(
                        4,
                            (index) => const Padding(
                          padding: EdgeInsets.only(bottom: 10.0),
                          child: PaymentDataCardLoadingComponent(),
                        ),
                      )
                          : isEmpty
                          ? [
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 40.0),
                          child: Center(
                            child: Text(
                              BenekStringHelpers.locale('noPaymentData'),
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16.0,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ]
                          : List.generate(
                        paymentData!.payments!.length,
                            (index) => Padding(
                          padding: const EdgeInsets.only(bottom: 10.0),
                          child: PaymentDataCardWidget(
                            payment: paymentData.payments![index],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

}