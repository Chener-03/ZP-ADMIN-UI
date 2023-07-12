// @ts-nocheck
import {request} from '@/utils/request';


export function getMenuList() {
  return request.get<Array<RouteItem>>({
    url:'/v1/user/api/web/getConcurrentUiRouting'
  })
}
