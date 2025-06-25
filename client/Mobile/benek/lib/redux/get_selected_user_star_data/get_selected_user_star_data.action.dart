// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/data/models/user_profile_models/star_data_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getSelectedUserStarDataAction( String? userId ) {
  return (Store<AppState> store) async {
    SelectedUserStarDataApi api = SelectedUserStarDataApi();

    if( userId == null ){
      return;
    }

    try {
      List<StarData>? _stars = await api.getSelectedUserStarDataRequest( userId );

      await store.dispatch(GetSelectedUserStarDataAction(_stars));
    } on ApiException catch (e) {
      log('ERROR: getStoriesByUserId - $e');
    }
  };
}

class GetSelectedUserStarDataAction {
  final List<StarData>? _stars;
  List<StarData>? get stars => _stars;
  GetSelectedUserStarDataAction(this._stars);
}