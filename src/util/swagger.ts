import ProductApiDoc from "../swagger/product.swagger";
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
        ...ProductApiDoc,
    }
}

export default SwaggerConfig;