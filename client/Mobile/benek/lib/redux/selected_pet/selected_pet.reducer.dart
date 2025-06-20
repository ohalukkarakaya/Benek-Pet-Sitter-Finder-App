import 'package:benek/data/models/pet_models/pet_model.dart';

import 'package:benek/store/actions/app_actions.dart';

PetModel? SetSelectedPetReducer( PetModel? state, dynamic action ){
  if( action is GetPetByIdRequestAction ){
    return action.pet;
  }else if( action is SetSelectedPetAction ){
    return action.pet;
  }else if( action is GetPetPhotosByIdRequestAction ){
    state!.images = action.petImages;
    return state;
  }
  return state;
}