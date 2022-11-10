import { createServer, IncomingMessage, ServerResponse } from "http";
import { parkingEntranceRequest } from "./api/parkingentrance";
import { parkingHistoryRequest } from "./api/parkinghistory";
import { parkingRequest } from "./api/parkinglot";

const listener = async(req: IncomingMessage, res: ServerResponse) =>{
    try{
        let result: string | object = ''
        if((req.url as string).match('/parking(.*?)')){
            result = await parkingRequest(req) as string | object
        }else if((req.url as string).match('/history(.*?)')){
            result = await parkingHistoryRequest(req) as string | object
        }else if((req.url as string).match('/entrance(.*?)')){
            result = await parkingEntranceRequest(req) as string | object
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    }
    catch(error){
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(error));
    }
}

const server = createServer(listener);
server.listen(8080);