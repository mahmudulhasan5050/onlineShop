"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCredentialsValidator = void 0;
var zod_1 = require("zod");
//here Zod is emplemented to create a validation schema
//Zod creates validation logic or rules and later it is passed to zodResolver-@hookform/resolvers (~/auth/sign-up)
//In @hookform/resolvers, other libray also can be used except Zod
exports.AuthCredentialsValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be 8 characters long.' }),
});
