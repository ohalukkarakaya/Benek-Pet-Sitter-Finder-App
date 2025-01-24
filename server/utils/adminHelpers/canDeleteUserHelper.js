import CareGive from "../../models/CareGive/CareGive.js";

const canDeleteUser = async (userId) => {
    try {
        // Kullanıcının bakıcı olduğu aktif kayıtları kontrol et
        const activeCareGiverRecord = await CareGive.findOne({
            "careGiver.careGiverId": userId,
            $or: [
                { "finishProcess.isFinished": false },
                { "isStarted": true }
            ]
        });

        // Kullanıcının hayvan sahibi olduğu aktif kayıtları kontrol et
        const activePetOwnerRecord = await CareGive.findOne({
            "petOwner.petOwnerId": userId,
            $or: [
                { "finishProcess.isFinished": false },
                { "isStarted": true }
            ]
        });

        // Eğer herhangi bir aktif kayıt varsa silme işlemini durdur
        if (activeCareGiverRecord || activePetOwnerRecord) {
            return false; // Kullanıcı silinemez
        }

        return true; // Kullanıcı silinebilir
    } catch (e) {
        console.log("Error: canDeleteUserHelper - ", e);
        throw e;
    }
}

export default canDeleteUser;