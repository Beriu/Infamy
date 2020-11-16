import {Client as FaunaClient} from "faunadb";

export default new FaunaClient(
{
        secret: process.env.FAUNADB_CLIENT_TOKEN as string,
        timeout: 3000,
    }
);