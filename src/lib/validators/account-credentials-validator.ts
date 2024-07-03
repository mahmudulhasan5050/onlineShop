import { z } from 'zod';
//here Zod is emplemented to create a validation schema
//Zod creates validation logic or rules and later it is passed to zodResolver-@hookform/resolvers (~/auth/sign-up)
//In @hookform/resolvers, other libray also can be used except Zod
export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be 8 characters long.' }),
});

//   create a typeScript validator
export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;
