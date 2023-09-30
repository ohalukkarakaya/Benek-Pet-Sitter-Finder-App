const routeList = [
    //authRoutes
    { path: "/auth/signUp", method: "POST" },
    { path: "/auth/login", method: "POST" },
    { path: "/auth/verifyOTP", method: "POST" },
    { path: "/auth/resendOtp", method: "POST" },

    //refresh token routes
    { path: "/api/refreshToken/", method: "POST" },
    { path: "/api/refreshToken/", method: "DELETE" },

    //care give routes
    { path: "/api/careGive/", method: "POST" },
    { path: "/api/careGive/invitations/:skip/:limit", method: "GET" },
    { path: "/api/careGive/sendedInvitations/:skip/:limit", method: "GET" },
    { path: "/api/careGive/start/:careGiveId", method: "PUT" },
    { path: "/api/careGive/getCareGiveList/:skip/:limit", method: "GET" },
    { path: "/api/careGive/getFinishedCareGiveList/:skip/:limit", method: "GET" },
    { path: "/api/careGive/getCareGive/:careGiveId", method: "GET" },
    { path: "/api/careGive/getPetOwnerCareGiveList/:skip/:limit", method: "GET" },
    { path: "/api/careGive/getPetOwnerFinishedCareGiveList/:skip/:limit", method: "GET" },
    { path: "/api/careGive/getCareGiverCareGiveList/:skip/:limit", method: "GET" },
    { path: "/api/careGive/getCareGiverFinishedCareGiveList/:skip/:limit", method: "GET" },
    { path: "/api/careGive/extend/:careGiveId", method: "PUT" },
    { path: "/api/careGive/finish/:careGiveId", method: "PUT" },
    { path: "/api/careGive/cancel/:careGiveId", method: "POST" },
    { path: "/api/careGive/giveStar/:careGiveId/:star", method: "POST" },
    { path:  "/api/careGive/:careGiveId/:response", method: "PUT" },

    //mission routes
    { path: "/api/careGive/mission/timeSignatureCode/:careGiveId/:missionId", method: "PUT" },
    { path: "/api/careGive/mission/:careGiveId/:missionId", method: "POST" },
    { path: "/api/careGive/mission/approve/:careGiveId/:missionId", method: "PUT" },
    { path: "/api/careGive/mission/report/:careGiveId/:missionId", method: "PUT" },
    { path: "/api/careGive/mission/getMissionCalenderByCareGiveId/:careGiveId/:skip/:limit", method: "GET" },
    { path: "/api/careGive/mission/getMissionCalender/:skip/:limit", method: "GET" },
    { path: "/api/careGive/mission/getMissionCalenderByPetId/:petId/:skip/:limit", method: "GET" },

    //schedule mission routes
    { path: "/api/careGive/mission/schedule/:careGiveId", method: "PUT" },
    { path: "/api/careGive/mission/schedule/delete/:careGiveId/:missionId", method: "DELETE" },

    //emergency routes
    { path: "/api/careGive/emergency/:careGiveId", method: "POST" },

    //chat routes
    { path: "/api/chat/create", method: "POST" },
    { path: "/api/chat/addMember/:chatId/:userId", method: "POST" },
    { path: "/api/chat/leave/:chatId", method: "DELETE" },
    { path: "/api/chat/image/:chatId", method: "POST" },
    { path: "/api/chat/name/:chatId", method: "POST" },
    { path: "/api/chat/desc/:chatId", method: "POST" },
    { path: "/api/chat/get/:skip/:limit", method: "GET" },
    { path: "/api/chat/search/:searchValue", method: "GET" },

    //messages routes
    { path: "/api/chat/messages/send/:chatId/:messageType", method: "POST" },
    { path: "/api/chat/messages/see/:chatId", method: "POST" },
    { path: "/api/chat/messages/get/:chatId/:skip/:limit", method: "GET" },

    //meeting routes
    { path: "/api/chat/meeting/getAllUsers/:chatId/:meetingId", method: "GET" },
    { path: "/api/chat/meeting/createMeet/:chatId", method: "POST" },
    { path: "/api/chat/meeting/isMeetingExist/:chatId/:meetingId", method: "POST" },

    //keywords routes
    { path: "/api/keywords/animals/:language", method: "GET" },
    { path: "/api/keywords/animals/insertInterestedPets", method: "POST" },
    { path: "/api/keywords/animals/getUsersByTag/:skip/:limit", method: "POST" },

    //log routes
    { path: "/log/byDatePeriod", method: "GET" },
    { path: "/log/byUserId/:userId", method: "GET" },
    { path: "/log/byRequestUrl", method: "POST" },
    { path: "/log/byUserIdAndDatePeriod/:userId", method: "GET" },
    { path: "/log/byRequestUrlAndDatePeriod", method: "POST" },
    { path: "/log/byRequestUrlAndUserId", method: "POST" },
    { path: "/log/byRequestUrlAndUserIdAndPeriod", method: "POST" },

    //notification routes
    { path: "/api/notification/:skip/:limit", method: "GET" },
    { path: "/api/notification/unSeenCount", method: "GET" },
    { path: "/api/notification/seen", method: "POST" },
    { path: "/api/notification/opened", method: "POST" },

    //pet routes
    { path: "/api/pet/createPet", method: "POST" },
    { path: "/api/pet/petProfileImage/:petId", method: "PUT" },
    { path: "/api/pet/editPetBioCertificate/:petId", method: "PUT"},
    { path: "/api/pet/petsImages/:petId", method: "PUT" },
    { path: "/api/pet/petsImages/:petId", method: "DELETE" },
    { path: "/api/pet/petsVaccinationCertificate/:petId", method: "PUT" },
    { path: "/api/pet/editVaccinationCertificate/:petId", method: "PUT" },
    { path: "/api/pet/petsVaccinationCertificate/:petId", method: "DELETE" },
    { path: "/api/pet/deletePet/:petId", method: "DELETE" },
    { path: "/api/pet/getPetById/:petId", method: "GET" },
    { path: "/api/pet/getPets", method: "GET" },
    { path: "/api/pet/getPetsByUserId/:userId", method: "GET" },
    { path: "/api/pet/getImageComments/:petId/:imageId/:skip/:limit", method: "GET" },
    { path: "/api/pet/getImageCommentsReplies/:petId/:imageId/:commentId/:skip/:limit", method: "GET" },

    //pet InterractionsRoutes
    { path: "/api/pet/interractions/followPet/:petId", method: "PUT" },
    { path: "/api/pet/interractions/likeImage", method: "PUT" },
    { path: "/api/pet/interractions/likeComment", method: "PUT" },
    { path: "/api/pet/interractions/petImageComment", method: "PUT" },
    { path: "/api/pet/interractions/petEditImageComment", method: "PUT" },
    { path: "/api/pet/interractions/petImageComment", method: "DELETE" },

    //pet owner operations routes
    { path: "/api/petOwner/inviteSecondaryOwner/:petId/:secondaryOwnerId", method: "POST" },
    { path: "/api/petOwner/secondaryOwnerInvitation/:invitationId/:usersResponse", method: "PUT" },
    { path: "/api/petOwner/secondaryOwnerInvitations/:skip/:limit", method: "GET" },
    { path: "/api/petOwner/sendedSecondaryOwnerInvitations/:skip/:limit", method: "GET" },
    { path: "/api/petOwner/removeSecondaryOwner/:petId/:secondaryOwnerId", method: "PUT" },
    { path: "/api/petOwner/petHandOverInvitation/:petId/:invitedUserId", method: "POST" },
    { path: "/api/petOwner/petHandOverInvitation/:invitationId/:usersResponse", method: "PUT" },
    { path: "/api/petOwner/petHandOverInvitations/:skip/:limit", method: "GET" },
    { path: "/api/petOwner/petSendedHandOverInvitations/:skip/:limit", method: "GET" },

    //user routes
    { path: "/api/user/moreUserInfo", method: "POST" },
    { path: "/api/user/birthday", method: "PUT" },
    { path: "/api/user/getLoggedInUserInfo", method: "GET" },
    { path: "/api/user/getUserById/:userId", method: "GET" },
    { path: "/api/user/allInvitations/:skip/:limit", method: "GET" },
    { path: "/api/user/getUsersAndEventsByLocation/:skip/:limit", method: "POST" },
    { path: "/api/user/getUsersAndEventsBySearchValue/:skip/:limit", method: "POST" },
    { path: "/api/user/getCareGiversByLocation/:skip/:limit", method: "POST" },
    { path: "/api/user/getCareGiversBySearchValue/:skip/:limit", method: "POST" },
    { path: "/api/user/getLightWeightUserInfo", method: "POST" },

    //profileSettings routes
    { path: "/api/user/profileSettings/resetUsername", method: "PUT" },
    { path: "/api/user/profileSettings/resetEmail", method: "POST" },
    { path: "/api/user/profileSettings/verifyResetEmailOTP", method: "POST" },
    { path: "/api/user/profileSettings/resetPassword", method: "PUT" },
    { path: "/api/user/profileSettings/forgetMyPassword", method: "PUT" },
    { path: "/api/user/profileSettings/addPhoneNumber", method: "POST" },
    { path: "/api/user/profileSettings/verifyPhoneNumber", method: "POST" },
    { path: "/api/user/profileSettings/addIdNo", method: "PUT" },
    { path: "/api/user/profileSettings/addAdress", method: "PUT" },
    { path: "/api/user/profileSettings/certificate", method: "POST" },
    { path: "/api/user/profileSettings/editCertificate", method: "PUT" },
    { path: "/api/user/profileSettings/certificate", method: "DELETE" },
    { path: "/api/user/profileSettings/careGiverPaymentInfo", method: "PUT" },
    { path: "/api/user/profileSettings/becomeCareGiver", method: "PUT" },
    { path: "/api/user/profileSettings/block/:userId", method: "PUT" },
    { path: "/api/user/profileSettings/unblock/:userId", method: "PUT" },
    { path: "/api/user/profileSettings/deactivate", method: "PUT" },
    { path: "/api/user/profileSettings/deleteUser", method: "DELETE" },

    //userInterractionsRoutes
    { path: "/api/user/interractions/followUser/:followingUserId", method: "PUT" },

    //story routes
    { path: "/api/user/interractions/story/", method: "POST" },
    { path: "/api/user/interractions/story/", method: "DELETE" },
    { path: "/api/user/interractions/story/:storyId", method: "PUT" },
    { path: "/api/user/interractions/story/getStoryByUserId/:userId", method: "GET" },
    { path: "/api/user/interractions/story/getRecomendedStoryList/:skip/:limit", method: "GET" },

    //story comments routes
    { path: "/api/user/interractions/story/comments/:storyId", method: "POST" },
    { path: "/api/user/interractions/story/comments/edit/:storyId", method: "PUT" },
    { path: "/api/user/interractions/story/comments/:storyId", method: "DELETE" },
    { path: "/api/user/interractions/story/comments/:storyId/:skip/:limit", method: "GET" },
    { path: "/api/user/interractions/story/comments/getReplies/:storyId/:commentId/:skip/:limit", method: "GET" },
    { path: "/api/user/interractions/story/comments/likeCommentOrReply", method: "PUT" },

    //event routes
    { path: "/api/user/interractions/event/", method: "POST" },
    { path: "/api/user/interractions/event/image/:eventId", method: "PUT" },
    { path: "/api/user/interractions/event/:eventId", method: "PUT" },
    { path: "/api/user/interractions/event/:eventId", method: "DELETE" },
    { path: "/api/user/interractions/event/getEvent/:eventId", method: "GET" },
    { path: "/api/user/interractions/event/getEvents", method: "GET" },
    { path: "/api/user/interractions/event/getRecomendedEvents/:skip/:limit", method: "GET" },

    //Event organizer routes
    { path: "/api/user/interractions/event/organizer/:eventId", method: "POST" },
    { path: "/api/user/interractions/event/organizer/getInvitations/:skip/:limit", method: "GET" },
    { path: "/api/user/interractions/event/organizer/getSendedInvitations/:skip/:limit", method: "GET" },
    { path: "/api/user/interractions/event/organizer/:invateId/:response", method: "DELETE" },
    { path: "/api/user/interractions/event/organizer/remove/:eventId", method: "PUT" },

    //event join routes
    { path: "/api/user/interractions/event/eventJoin/invitation/:eventId/:invitedUserId", method: "POST" },
    { path: "/api/user/interractions/event/eventJoin/invitation/:invitationId/:response", method: "PUT" },
    { path: "/api/user/interractions/event/eventJoin/:eventId", method: "POST" },
    { path: "/api/user/interractions/event/eventJoin/:eventId", method: "PUT" },
    { path: "/api/user/interractions/event/eventJoin/getInvitationList/:skip/:limit", method: "GET" },
    { path: "/api/user/interractions/event/eventJoin/getSendedInvitationList/:skip/:limit", method: "GET" },
    { path: "/api/user/interractions/event/eventJoin/getOwnedTickets", method: "GET" },
    { path: "/api/user/interractions/event/eventJoin/getTicketById/:ticketId", method: "GET" },
    { path: "/api/user/interractions/event/eventJoin/getTicketsByEventId/:eventId/:skip/:limit", method: "GET" },

    //after event routes
    { path: "/api/user/interractions/event/afterEvent/:eventId", method: "POST" },
    { path: "/api/user/interractions/event/afterEvent/:eventId/:contentId", method: "PUT" },
    { path: "/api/user/interractions/event/afterEvent/:eventId/:contentId", method: "DELETE" },
    { path: "/api/user/interractions/event/afterEvent/like/:eventId/:contentId", method: "PUT" },
    { path: "/api/user/interractions/event/afterEvent/get/:eventId/:skip/:limit", method: "GET" },

    //after event comment routes
    { path: "/api/user/interractions/event/afterEvent/comment/:eventId/:contentId", method: "PUT" },
    { path: "/api/user/interractions/event/afterEvent/comment/edit/:eventId/:contentId", method: "PUT" },
    { path: "/api/user/interractions/event/afterEvent/comment/:eventId/:contentId", method: "DELETE" },
    { path: "/api/user/interractions/event/afterEvent/comment/like/:eventId/:contentId", method: "PUT" },
    { path: "/api/user/interractions/event/afterEvent/comment/getComments/:eventId/:contentId/:skip/:limit", method: "GET" },
    { path: "/api/user/interractions/event/afterEvent/comment/getReplies/:eventId/:contentId/:commentId/:skip/:limit", method: "GET" },

    //payment routes
    { path: "/api/payment/redirect", method: "POST" },
    { path: "/api/payment/redirect", method: "GET" },
    { path: "/api/payment/getRegisteredCards", method: "GET" },
    { path: "/api/payment/deleteCard/:cardToken", method: "DELETE" },
];

export default routeList;