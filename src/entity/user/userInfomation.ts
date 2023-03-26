import { UserBase } from '@/entity/user/userBase';
import { UserExtends } from '@/entity/user/userExtends';

export class UserInfomation {
  public userBase: UserBase;
  public userExtend: UserExtends;
  public roleList: string[] = [];
}
