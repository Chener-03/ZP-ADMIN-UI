import { AuthPe } from "./AnthPe";
import { InPe } from "./InPe";
import {SqlPe} from "@/pages/datasharing/requestconfig/entity/SqlPe";
import {InJsPe} from "@/pages/datasharing/requestconfig/entity/InJsPe";
import {OutPe} from "@/pages/datasharing/requestconfig/entity/OutPe";
import {OutDataPe} from "@/pages/datasharing/requestconfig/entity/OutDataPe";
import {OutJsPe} from "@/pages/datasharing/requestconfig/entity/OutJsPe";



export class DsRequestConfigAllDto {
  dsRequestConfigDto: Object = {};
  authPe: AuthPe = new AuthPe();
  inPe: InPe = new InPe();
  inJsPe: InJsPe = new InJsPe();
  sqlPe: SqlPe = new SqlPe();
  outPe: OutPe = new OutPe();
  outJsPe: OutJsPe = new OutJsPe();
  outDataPe: OutDataPe = new OutDataPe();
}



