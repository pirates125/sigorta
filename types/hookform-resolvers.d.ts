declare module '@hookform/resolvers/zod' {
  import { Resolver } from 'react-hook-form';
  import { z } from 'zod';

  export function zodResolver<T extends z.ZodType<any, any, any>>(
    schema: T,
    schemaOptions?: any,
    resolverOptions?: any
  ): Resolver<z.infer<T>>;
}

