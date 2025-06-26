import User from "../../../models/User.js";
import UserOTPVerification from "../../../models/UserOtpVerification.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const verifyOtpController = async (req, res) => {
    try {
        let { userId, email, otp, ip } = req.body;

        // Email varsa, userId'yi bul
        if (!userId && email) {
            const user = await User.findOne({ email }).clone();
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: "Email adresine ait kullanıcı bulunamadı",
                });
            }
            userId = user._id;
        }

        const otpRecords = await UserOTPVerification.find({ userId }).clone();

        if (!otpRecords || otpRecords.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Kayıt bulunamadı veya zaten doğrulanmış",
            });
        }

        const { expiresAt, otp: hashedOTP } = otpRecords[0];

        if (expiresAt < Date.now()) {
            await UserOTPVerification.deleteMany({ userId });
            return res.status(405).json({
                error: true,
                message: "Kodun süresi dolmuş. Lütfen tekrar isteyin",
            });
        }

        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            return res.status(406).json({
                error: true,
                message: "Geçersiz kod girdiniz. Gelen kutunuzu kontrol edin.",
            });
        }

        // Kullanıcıyı getir
        const user = await User.findById(userId).clone();

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Kullanıcı bulunamadı",
            });
        }

        // IP kontrolü
        if (user.isLoggedInIpTrusted && !user.trustedIps.includes(ip)) {
            return res.status(405).json({
                error: true,
                message: "Bu IP adresi güvenilir değil. Kendi cihazınızdan giriş yapın.",
            });
        }

        // Yeni IP ve doğrulanmış email ise: IP güvenilir hale getir
        if (!user.trustedIps.includes(ip) && !user.isLoggedInIpTrusted && user.isEmailVerified) {
            await User.updateOne({ _id: userId }, {
                $push: { trustedIps: ip },
                isLoggedInIpTrusted: true
            });
            await UserOTPVerification.deleteMany({ userId });
            return res.status(200).json({
                error: false,
                message: "IP başarıyla doğrulandı",
            });
        }

        // Her şey yolundaysa: Email doğrula
        await User.updateOne({ _id: userId }, { isEmailVerified: true });
        await UserOTPVerification.deleteMany({ userId });

        return res.status(200).json({
            error: false,
            message: "Kullanıcı email'i başarıyla doğrulandı",
        });
    } catch (err) {
        console.error("ERROR: verifyOtpController -", err);
        return res.status(500).json({
            error: true,
            message: "Sunucu hatası oluştu",
        });
    }
};

export default verifyOtpController;