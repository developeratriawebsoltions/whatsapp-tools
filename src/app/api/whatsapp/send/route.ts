import whatsappService from "@/services/whatsapp.service";


export async function POST(
    req: Request
) {

    const body =
        await req.json();


    const result =
        await whatsappService.sendMessage(
            body.number,
            body.message
        );



    return Response.json({
        success: true,
        result
    });


}