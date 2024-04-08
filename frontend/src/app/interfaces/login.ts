// 用于将登录信息封装后发送到api
export interface Login {
  userID: string;
  userPasswordMD5: string;
}
