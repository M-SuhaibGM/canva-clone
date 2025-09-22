import { db } from "@/lib/db";


const getDesignbyId = async (designId) => {

    if(!designId){
        return
    }
    const design = await db.designSchema.findUnique({
        where: {
            id: designId
        }
    })

    return design
}

export default getDesignbyId