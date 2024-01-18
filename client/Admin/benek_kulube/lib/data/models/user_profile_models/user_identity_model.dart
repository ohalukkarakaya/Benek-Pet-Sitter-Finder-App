import 'package:benek_kulube/data/models/user_profile_models/user_caregiver_certificate_model.dart';

class UserIdentity {
  String? firstName;
  String? middleName;
  String? lastName;
  String? openAdress;
  String? job;
  String? bio;
  List<UserCareGiverCertificates>? certificates;

  UserIdentity(
    {
      this.firstName,
      this.middleName,
      this.lastName,
      this.openAdress,
      this.job,
      this.bio,
      this.certificates
    }
  );

  UserIdentity.fromJson( Map<String, dynamic> json ){
    firstName = json['firstName'];
    middleName = json['middleName'];
    lastName = json['lastName'];
    openAdress = json['openAdress'];
    job = json['job'];
    bio = json['bio'];
    if( json['certificates'] != null ){
      certificates = <UserCareGiverCertificates>[];
      json['certificates'].forEach(
        ( v ){
          certificates!.add( UserCareGiverCertificates.fromJson( v ) );
        }
      );
    }
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['firstName'] = firstName;
    data['middleName'] = middleName;
    data['lastName'] = lastName;
    data['openAdress'] = openAdress;
    data['job'] = job;
    data['bio'] = bio;
    if (certificates != null) {
      data['certificates'] = certificates!.map(
        ( v ) => 
              v.toJson()
      ).toList();
    }
    return data;
  }
}