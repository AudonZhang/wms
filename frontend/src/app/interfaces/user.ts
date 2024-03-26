// used by user service to deliver information
export interface User {
  userID: string;
  userName: string;
  userGender: string;
  userPasswordMD5: string;
  userPhone: string;
  userEmail: string;
  userRole: string;
  userStatus: string;
  userCreatedByID: string;
  userCreatedTime: string;
}
