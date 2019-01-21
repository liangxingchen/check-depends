declare namespace CheckDepends {
  type Value = any;

  interface ComparisonExpression {
    $eq?: Value;
    $ne?: Value;
    $gt?: Value;
    $gte?: Value;
    $lt?: Value;
    $lte?: Value;
    $in?: Value[];
    $nin?: Value[];
    $not?: ComparisonExpression;
    $regex?: RegExp | 'string';
    /**
     * RegExp options: i m g
     */
    $options?: string;
    $all?: Array<Value | ComparisonExpression>;
    $elemMatch?: QueryExpression | ComparisonExpression;
    $size?: number;
    $exists?: boolean;
  }

  interface QueryExpression {
    [key: string]: Value | ComparisonExpression;
    $and?: QueryExpression[];
    $nor?: QueryExpression[];
    $or?: QueryExpression[];
    $jsonSchema?: any;
  }


  type DependsQueryExpression = void | null | boolean | string | QueryExpression;
}


declare function CheckDepends(depends: CheckDepends.DependsQueryExpression, data: any): boolean;

export = CheckDepends;
