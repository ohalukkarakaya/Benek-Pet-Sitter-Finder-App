import 'dart:io';
import 'package:excel/excel.dart';
import 'package:benek/data/models/payment_data_models/payment_data_model.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:path_provider/path_provider.dart';

Future<void> generateStyledPaymentsExcel(List<PaymentDataModel> payments) async {
  final excel = Excel.createExcel(); // default "Sheet1"
  final Sheet? sheet = excel.sheets['Sheet1'];

  if (sheet == null) {
    print("❌ Sheet1 bulunamadı.");
    return;
  }

  print("Export edilen kayıt sayısı: ${payments.length}");

  sheet.appendRow([
    BenekStringHelpers.locale('careGiverFullName'),
    BenekStringHelpers.locale('careGiverTc'),
    BenekStringHelpers.locale('careGiverEmail'),
    BenekStringHelpers.locale('careGiverPhone'),
    BenekStringHelpers.locale('careGiverOpenAddress'),
    BenekStringHelpers.locale('petOwnerFullName'),
    BenekStringHelpers.locale('petOwnerEmail'),
    BenekStringHelpers.locale('petOwnerPhone'),
    BenekStringHelpers.locale('paymentAmount'),
    BenekStringHelpers.locale('paymentDate'),
  ]);

  for (final payment in payments) {
    final caregiver = payment.careGiver;
    final petOwner = payment.petOwner;

    final cgIdentity = caregiver?.identity;
    final poIdentity = petOwner?.identity;

    final caregiverFullName = BenekStringHelpers.getUsersFullName(
      cgIdentity!.firstName!,
      cgIdentity.lastName!,
      cgIdentity.middleName,
    );

    final petOwnerFullName = BenekStringHelpers.getUsersFullName(
      poIdentity!.firstName!,
      poIdentity.lastName!,
      poIdentity.middleName,
    );

    final formattedDate = BenekStringHelpers.getDateAsString(payment.date!);

    sheet.appendRow([
      caregiverFullName,
      cgIdentity.nationalIdentityNumber ?? "",
      caregiver?.email ?? "",
      caregiver?.phone ?? "",
      cgIdentity.openAdress ?? "",
      petOwnerFullName,
      petOwner?.email ?? "",
      petOwner?.phone ?? "",
      payment.amount ?? "",
      formattedDate,
    ]);
  }

  final bytes = excel.encode();
  if (bytes == null || bytes.isEmpty) {
    print("❌ Excel encode başarısız.");
    return;
  }

  // Geçici klasöre yaz (kullanıcıyı kaydetme zorunda bırakmaz)
  final tempDir = await getTemporaryDirectory();
  final path = '${tempDir.path}/benek_payments.xlsx';
  final file = File(path);
  await file.writeAsBytes(bytes, flush: true);

  print('📂 Geçici Excel dosyası oluşturuldu: $path');

  // Excel uygulamasında aç
  await openExcelFile(path);
}

Future<void> openExcelFile(String path) async {
  if (Platform.isMacOS) {
    await Process.run('open', [path]);
  } else if (Platform.isWindows) {
    await Process.run('cmd', ['/c', 'start', path]);
  } else if (Platform.isLinux) {
    await Process.run('xdg-open', [path]);
  } else {
    print('📂 Otomatik açma bu platformda desteklenmiyor.');
  }
}