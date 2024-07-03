import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from './index';

// frontend get info from appRouter
export const trpc = createTRPCReact<AppRouter>({});
