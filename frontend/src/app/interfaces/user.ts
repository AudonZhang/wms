// 用于映射mysql中的user表
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
