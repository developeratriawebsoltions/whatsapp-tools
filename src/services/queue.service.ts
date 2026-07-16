import {Queue} from "bullmq";


class QueueService {


private whatsappQueue:Queue;


constructor(){

this.whatsappQueue =
new Queue(
"whatsapp",
{
connection:{
host:"localhost",
port:6379
}
}
);


}



async addMessage(
data:any
){

return this.whatsappQueue.add(
"send-message",
data
);


}


}


export default new QueueService();