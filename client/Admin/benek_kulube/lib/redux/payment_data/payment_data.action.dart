// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/data/models/payment_data_models/payment_data_model.dart';
import 'package:benek_kulube/data/models/payment_data_models/payment_satate_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';


ThunkAction<AppState> getPaymentDataListAction() {
  return (Store<AppState> store) async {
    PaymentDataApi api = PaymentDataApi();

    try{
      List<PaymentDataModel>? _payments = await api.getPaymentDataListByDateRequest();
      PaymentStateModel existingPayments = store.state.paymentData ?? PaymentStateModel(
        profit: 0,
        customersShare: 0,
        customersTax: 0,
        totalMoneyOnPool: 0,
        payments: [],
      );

      if (_payments != null) {
        existingPayments.setPayments(_payments);
      }

      await store.dispatch(GetPaymentDataListAction(existingPayments));
    }on ApiException catch (e) {
      log('ERROR: getReportedMissionList - $e');
    }
  };
}

ThunkAction<AppState> getPaymentCountOnPoolAction() {
  return (Store<AppState> store) async {
    PaymentDataApi api = PaymentDataApi();

    try {
      Map<String, dynamic>? paymentCount = await api.getPaymentCountOnPoolRequest();
      if (paymentCount != null) {
        PaymentStateModel existingPayments = store.state.paymentData ?? PaymentStateModel(
          profit: 0,
          customersShare: 0,
          customersTax: 0,
          totalMoneyOnPool: 0,
          payments: [],
        );

        existingPayments.setMoneyInfo(
          paymentCount['profit'] ?? 0,
          paymentCount['customersShare'] ?? 0,
          paymentCount['customersTax'] ?? 0,
          paymentCount['totalMoneyOnPool'] ?? 0,
        );

        await store.dispatch(GetPaymentDataListAction(existingPayments));
      }
    } on ApiException catch (e) {
      log('ERROR: getPaymentCountOnPool - $e');
    }
  };
}

ThunkAction<AppState> resetPaymentDataListAction() {
  return (Store<AppState> store) async {
    try {
      await store.dispatch(GetPaymentDataListAction(null));
    } on ApiException catch (e) {
      log('ERROR: resetPaymentDataList - $e');
    }
  };
}

class GetPaymentDataListAction {
  final PaymentStateModel? paymentData;
  GetPaymentDataListAction(this.paymentData);
}