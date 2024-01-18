class KulubeLoginQrCodeModel {
  final String qrCode;
  final String clientId;
  final DateTime? expireTime;

  KulubeLoginQrCodeModel(
    {
      required this.qrCode,
      required this.clientId,
      this.expireTime
    }
  );
}