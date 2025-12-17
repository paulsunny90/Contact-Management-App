import express from "express"

import {
    creatContact,
    readContact,
    updatContact,
    deleteContact
    
} from "../conntrols/contact.controllers.js"
const routes = express.Router()

routes.post("/",creatContact),
routes.get("/",readContact),
routes.put("/:id",updatContact),
routes.delete("/:id",deleteContact)



export default routes;


