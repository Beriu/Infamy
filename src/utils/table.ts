import codeText from "./codeText";
import {table, TableColumns, TableUserConfig} from "table";

export default function (data: Array<any>, rows: Array<string>, config?: TableUserConfig) {

    if(data[0].length !== rows.length) {
        throw Error('Rows length doesn\'t match data length.');
    }
    if(!config) {
        config = {} as TableUserConfig;
        config.columns = {};

        for(let i = 0; i < data[0].length; i++) {
            if(i === 0) {
                config.columns[i] = { alignment: 'left' } as TableColumns;
                continue;
            }
            config.columns[i] = { alignment: 'center', width: 10 } as TableColumns;
        }
    }
    return codeText(
        table([ rows, ...data ], config)
    );
}