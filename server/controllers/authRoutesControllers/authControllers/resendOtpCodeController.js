import User from "../../../models/User.js";
import UserOTPVerification from "../../../models/UserOtpVerification.js";
import sendOTPVerificationEmail from "../../../utils/sendValidationEmail.js";
import dotenv from "dotenv";

dotenv.config();

const resendOtpCodeController = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: true,
                message: "Email gereklidir.",
            });
        }

        // Email ile kullanıcıyı bul
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Bu email adresine ait kullanıcı bulunamadı.",
            });
        }

        const userId = user._id;

        // Eski OTP kayıtlarını sil
        await UserOTPVerification.deleteMany({ userId });

        // Yeni OTP gönder
        sendOTPVerificationEmail({ _id: userId, email }, res, null);

    } catch (err) {
        console.error("resendOtpCodeController HATASI:", err);
        res.status(500).json({
            error: true,
            message: "Sunucu hatası",
        });
    }
};

export default resendOtpCodeController;
