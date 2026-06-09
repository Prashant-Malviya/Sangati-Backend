import AuthApiDoc from "../swagger/auth.swagger";
import FriendApiDoc from "../swagger/friend.swagger";
import StorageApiDoc from "../swagger/storage.swagger";
const SwaggerConfig = {
    openapi : "3.0.0",
    info: {
        title: "Sangati Official Api",
        description: "All private and public apis listed here",
        version: "1.0.0",
        contact: {
            name: "Prashant Malviya",
            email: "prashantmalviya272002@gmail.com"
        }
    },
    server : [
        {url: process.env.SERVER}
    ],
    paths: {
        ...AuthApiDoc,
        ...StorageApiDoc,
        ...FriendApiDoc,
    }
}

export default SwaggerConfig;