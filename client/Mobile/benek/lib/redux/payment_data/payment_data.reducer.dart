import 'package:benek/data/models/payment_data_models/payment_satate_model.dart';

import '../../store/actions/app_actions.dart';

PaymentStateModel? paymentDataReducer( PaymentStateModel? payments, dynamic action ) {
  if( action is GetPaymentDataListAction ){
    return action.paymentData;
  }

  return payments;
}