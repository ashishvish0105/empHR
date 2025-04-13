// export interface UserProfile {
//   id: string;
//   fullName: string;
//   email: string;
//   phone?: string;
//   location?: string;
//   notificationPreferences: {
//     emailNotifications: boolean;
//     weeklyDigest: boolean;
//     newFeatures: boolean;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  notificationPreferences: notificationPreferences;
  profilePicture?: string;
  role: string;
}
export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdate {
  fullName?: string;
  email?: string;
  profilePicture?: string;
  notificationPreferences?: notificationPreferences
}

export interface  notificationPreferences {
    emailNotifications?: boolean;
    searchAlerts?: boolean;
    weeklyDigest?: boolean;
    newFeatures?: boolean;
  };
