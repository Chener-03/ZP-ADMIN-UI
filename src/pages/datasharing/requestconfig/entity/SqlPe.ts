export class SqlPe {
  sqls: SqlEntity[] = [];
  dataSourceId: string;
}

export class SqlEntity {
  sql: string;
  type: string;
  compileSql: string;
}

export namespace SqlPe {
  export const TYPE_SELECT = 'select';
  export const TYPE_UPDATE = 'update';
}
