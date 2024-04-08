import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../../../../../data/models/user_profile_models/user_location_model.dart';

class ProfileAdresMapWidget extends StatelessWidget {
  final UserLocation userLocation;
  const ProfileAdresMapWidget({
    super.key,
    required this.userLocation
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(6.0),
      child: SizedBox(
        width: 200,
        height: 200,
        child: IgnorePointer(
          ignoring: true,
          child: FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(userLocation.lat!, userLocation.lng!),
                initialZoom: 15.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.benek.app',
                ),
                MarkerLayer(
                  markers: [
                    Marker(
                      width: 40.0,
                      height: 40.0,
                      point: LatLng(userLocation.lat!, userLocation.lng!),
                      child: Container(
                        width: 40.0,
                        height: 40.0,
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
                          )
                        ),
                      ),
                    ),
                  ],
                ),
              ]
          ),
        ),
      ),
    );
  }
}
