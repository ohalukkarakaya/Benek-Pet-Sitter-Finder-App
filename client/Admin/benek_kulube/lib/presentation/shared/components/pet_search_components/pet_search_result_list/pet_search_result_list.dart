import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/presentation/shared/components/pet_search_components/pet_search_result_list/pet_search_result_list_custom_scroll_view.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../data/models/pet_models/pet_list_model.dart';
import '../../../../../data/models/pet_models/pet_model.dart';

class PetSearchResultList extends StatefulWidget {
  final Store<AppState> store;
  final Function( PetModel ) onPetHoverCallback;
  final Function() onPetHoverExitCallback;
  const PetSearchResultList({
    super.key,
    required this.store,
    required this.onPetHoverCallback,
    required this.onPetHoverExitCallback
  });

  @override
  State<PetSearchResultList> createState() => _PetSearchResultListState();
}

class _PetSearchResultListState extends State<PetSearchResultList> {
  late int itemCount;
  List<PetModel>? resultData;

  @override
  void initState() {
    super.initState();

    Store<AppState> store = AppReduxStore.currentStore!;

    store.dispatch(resetPetSearchDataAction());
    _updateResultData();
  }

  void _updateResultData() {
    resultData = checkIfPetSearch()
        ? widget.store.state.petSearchResultList!.pets!
        : isRecommendedPetsNotEmpty()
            ? widget.store.state.userInfo!.recommendedPets!
            : null;

    itemCount = resultData?.length ?? 0;
  }

  bool checkIfPetSearch(){
    return widget.store.state.petSearchResultList != null
        && widget.store.state.petSearchResultList!.pets!.isNotEmpty;
  }

  bool isRecommendedPetsNotEmpty(){
    return widget.store.state.userInfo!.recommendedPets != null
        &&  widget.store.state.userInfo!.recommendedPets!.isNotEmpty;
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: 9,
      child: StoreConnector<AppState, PetListModel?>(
        converter: (store) {
          final PetListModel? resultDataObject = store.state.petSearchResultList
              ?? PetListModel(
                  totalDataCount: store.state.userInfo!.recommendedPets?.length,
                  pets: store.state.userInfo!.recommendedPets
              );

          return resultDataObject;
        },
        builder: (context, resultDataObject) {
          PetListModel? resultData = resultDataObject;
          _updateResultData();
          double totalHeight = 0.0;
          totalHeight = 80.0 * itemCount;

          double lastChildHeight = totalHeight + 50 + (20 * (itemCount - 1));
          double dynamicHeightLimit = 678.6;

          if (resultData == null || resultData.pets == null || resultData.pets!.isEmpty) {
            return const SizedBox.shrink();
          }

          bool isPetSearch = checkIfPetSearch();

          return Column(
            children: [
              Container(
                decoration: BoxDecoration(
                  color: AppColors.benekBlack,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(6.0),
                    topRight: const Radius.circular(6.0),
                    bottomLeft: lastChildHeight <= dynamicHeightLimit
                        ? const Radius.circular(6.0)
                        : const Radius.circular(0.0),
                    bottomRight: lastChildHeight <= dynamicHeightLimit
                        ? const Radius.circular(6.0)
                        : const Radius.circular(0.0),
                  ),
                ),
                height: lastChildHeight <= dynamicHeightLimit ? lastChildHeight : dynamicHeightLimit,
                padding: const EdgeInsets.all(10.0),
                child: ScrollConfiguration(
                  behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                  // ignore: unnecessary_null_comparison
                  child: resultData != null
                      && resultData.pets != null
                      && resultData.pets!.isNotEmpty
                        ? PetSearchResultListCustomScrollViewWidget(
                            lastChildHeight: lastChildHeight,
                            resultData: resultData.pets,
                            isPetSearch: isPetSearch,
                            onPetHoverCallback: widget.onPetHoverCallback,
                            onPetHoverExitCallback: widget.onPetHoverExitCallback
                        )
                        : const SizedBox(),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

}

