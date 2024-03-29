// 用于将登录信息通过一次post发送到api
export interface Login {
  userID: string;
  userPasswordMD5: string;
}
