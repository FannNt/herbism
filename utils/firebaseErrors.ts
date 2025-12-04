export function getFirebaseErrorMessage(error: any): string {
    const errorCode = error?.code || "";
    const errorMessage = error?.message || "";

    // Auth Errors
    const errorMessages: Record<string, string> = {
        // Email/Password Error
        "auth/email-already-in-use": "Email ini sudah terdaftar. Silakan gunakan email lain atau login.",
        "auth/invalid-email": "Format email tidak valid. Silakan periksa kembali email Anda.",
        "auth/user-disabled": "Akun ini telah dinonaktifkan. Hubungi administrator.",
        "auth/user-not-found": "Email tidak terdaftar. Silakan daftar terlebih dahulu.",
        "auth/wrong-password": "Password salah. Silakan coba lagi.",
        "auth/invalid-credential": "Email atau password salah. Silakan periksa kembali.",

        // Sinyal Error
        "auth/network-request-failed": "Koneksi internet bermasalah. Silakan periksa koneksi Anda.",
        "auth/too-many-requests": "Terlalu banyak percobaan. Silakan coba lagi nanti.",

        // Google Error
        "auth/popup-closed-by-user": "Login dibatalkan. Silakan coba lagi.",
        "auth/popup-blocked": "Popup diblokir oleh browser. Silakan izinkan popup untuk website ini.",
        "auth/cancelled-popup-request": "Login dibatalkan. Silakan coba lagi.",

        // Token Error
        "auth/invalid-api-key": "Konfigurasi Firebase tidak valid. Hubungi administrator.",
        "auth/app-deleted": "Aplikasi Firebase tidak ditemukan. Hubungi administrator.",

        // Errorlain
        "auth/requires-recent-login": "Silakan login ulang untuk melanjutkan.",
        "auth/account-exists-with-different-credential": "Email ini sudah terdaftar dengan metode login berbeda.",
    };

    if (errorCode && errorMessages[errorCode]) {
        return errorMessages[errorCode];
    }

    if (errorMessage.includes("email-already-in-use")) {
        return "Email ini sudah terdaftar. Silakan gunakan email lain atau login.";
    }
    if (errorMessage.includes("wrong-password") || errorMessage.includes("invalid-credential")) {
        return "Email atau password salah. Silakan periksa kembali.";
    }
    if (errorMessage.includes("user-not-found")) {
        return "Email tidak terdaftar. Silakan daftar terlebih dahulu.";
    }
    if (errorMessage.includes("weak-password")) {
        return "Password terlalu lemah. Gunakan minimal 8 karakter.";
    }
    if (errorMessage.includes("network")) {
        return "Koneksi internet bermasalah. Silakan periksa koneksi Anda.";
    }

    // Default 
    return "Terjadi kesalahan. Silakan coba lagi.";
}

export function getFirebaseErrorTitle(error: any): string {
    const errorCode = error?.code || "";

    const errorTitles: Record<string, string> = {
        "auth/email-already-in-use": "Email Sudah Terdaftar",
        "auth/invalid-email": "Email Tidak Valid",
        "auth/user-disabled": "Akun Dinonaktifkan",
        "auth/user-not-found": "Email Tidak Ditemukan",
        "auth/wrong-password": "Password Salah",
        "auth/invalid-credential": "Login Gagal",
        "auth/weak-password": "Password Terlalu Lemah",
        "auth/network-request-failed": "Koneksi Bermasalah",
        "auth/too-many-requests": "Terlalu Banyak Percobaan",
        "auth/popup-closed-by-user": "Login Dibatalkan",
        "auth/popup-blocked": "Popup Diblokir",
    };

    return errorTitles[errorCode] || "Terjadi Kesalahan";
}
