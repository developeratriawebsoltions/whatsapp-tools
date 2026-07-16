import {prisma} from "@/lib/prisma";


class MessageService {


async create(data:any){


    return await prisma.message.create({

        data

    });


}



async getAll(){

    return await prisma.message.findMany({

        orderBy:{
            createdAt:"desc"
        }

    });

}


}


export default new MessageService();