"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserAdmin = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.makeUserAdmin = functions.https.onCall(async (data, context) => {
    // Check if the request is made by an admin
    if (!(context.auth && await isUserAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "Only admins can make other users admins.");
    }
    const { uid } = data;
    if (!uid) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with a valid uid.");
    }
    // Update the user document
    await admin.firestore().collection("users").doc(uid).update({
        isAdmin: true,
    });
    return { result: `User ${uid} has been made an admin.` };
});
/**
 * Checks if a user is an admin.
 * @param {string} uid - The user ID to check.
 * @return {Promise<boolean>} True if the user is an admin, false otherwise.
 */
async function isUserAdmin(uid) {
    var _a;
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    return ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.isAdmin) === true;
}
//# sourceMappingURL=index.js.map