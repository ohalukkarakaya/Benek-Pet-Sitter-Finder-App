import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../data/models/pet_models/pet_list_model.dart';

PetListModel? petSearchRequestReducer( PetListModel? petSearchListData, dynamic action ){
  if( action is PetSearchRequestAction ){
    return action.searchListData;
  }

  return petSearchListData;
}