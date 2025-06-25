import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/benek_toast_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../../common/constants/turkish_cities_data_list.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../../../../../../data/services/api.dart';
import 'address_info_bar.dart';
import 'address_save_button.dart';
import 'location_warning_widget.dart';
import 'map_back_and_cancel_button.dart';

class ChooseLocationFromMapScreen extends StatefulWidget {
  final UserInfo userInfo;
  const ChooseLocationFromMapScreen({
    super.key,
    required this.userInfo,
  });

  @override
  State<ChooseLocationFromMapScreen> createState() => _ChooseLocationFromMapScreenState();
}

class _ChooseLocationFromMapScreenState extends State<ChooseLocationFromMapScreen> {
  bool isOutOfTurkey = false;

  bool didChanged = false;
  double? newLat;
  double? newLng;

  double? processingLat;
  double? processingLng;

  double markerSize = 40.0;

  String? city;
  String? adress;

  final LatLngBounds turkeyBounds = LatLngBounds(
    LatLng(36.0, 26.0),
    LatLng(42.0, 45.0),
  );

  @override
  void initState() {
    super.initState();
    city = widget.userInfo.location!.city;
    adress = widget.userInfo.identity!.openAdress;
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Stack(
        children: [
          FlutterMap(
            options: MapOptions(
              initialCenter: LatLng(widget.userInfo.location!.lat!, widget.userInfo.location!.lng!),
              initialZoom: 15.0,
              minZoom: 5.0,
              maxZoom: 18.0,
              cameraConstraint: CameraConstraint.contain(bounds: turkeyBounds),
              onPositionChanged: (MapCamera camera, bool hasGesture) {
                setState(() {
                  processingLat = camera.center.latitude;
                  processingLng = camera.center.longitude;
                  if (hasGesture) {
                    markerSize = 50.0;
                  }
                });
              },
              onMapEvent: (event) async {
                if (event is MapEventMoveEnd) {
                  setState(() {
                    newLat = processingLat;
                    newLng = processingLng;
                    didChanged = true;
                    processingLat = null;
                    processingLng = null;

                    if (newLat == null || newLng == null) return;
                    String? cityName = findCityForCoordinates(newLat!, newLng!);
                    if (cityName != null) city = cityName;
                    markerSize = 40.0;
                  });

                  if (newLat == null || newLng == null) return;

                  Map<String, dynamic>? newAdressData = await GeocodingApi.getAdressFromCoordinates(newLat!, newLng!);
                  if (newAdressData != null) {
                    if (newAdressData['country_code'] != 'tr') {
                      BenekToastHelper.showErrorToast(
                        BenekStringHelpers.locale('Error'),
                        BenekStringHelpers.locale('outOfTurkey'),
                        context,
                      );
                      setState(() {
                        isOutOfTurkey = true;
                      });
                      return;
                    }
                    setState(() {
                      adress = newAdressData['display_name'];
                      if (newAdressData['city'] != null) city = newAdressData['city'];
                      isOutOfTurkey = false;
                    });
                  }
                }
              },
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.benek.app',
              ),
            ],
          ),

          /// Marker
          Center(
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: markerSize,
              height: markerSize,
              decoration: BoxDecoration(
                color: AppColors.benekUltraDarkBlue.withOpacity(0.3),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Container(
                  width: 10.0,
                  height: 10.0,
                  decoration: const BoxDecoration(
                    color: AppColors.benekBlack,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ),
          ),

          /// Alt Panel (Wrap + Column)
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Wrap(
                    spacing: 6.0,
                    runSpacing: 6.0,
                    children: [
                      MapBackAndCancelButton(didEdit: didChanged),
                      const InfoBar(infoText: 'TUR'),
                      if (city != null) InfoBar(infoText: city!),
                      if (adress != null) InfoBar(isOpenAdress: true, infoText: adress!),
                    ],
                  ),
                  const SizedBox(height: 8.0),
                  AddressSaveButton(
                    didEdit: didChanged && !isOutOfTurkey,
                    address: adress,
                    city: city,
                    lat: newLat,
                    lng: newLng,
                  ),
                ],
              ),
            ),
          ),

          const Align(
            alignment: Alignment.topLeft,
            child: LocationWarningWidget(),
          ),
        ],
      ),
    );
  }
}