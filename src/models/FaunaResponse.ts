import {values} from "faunadb";
import Ref = values.Ref;

export type FaunaResponse<T> = {
    ref: Ref,
    ts: number,
    data: T
};