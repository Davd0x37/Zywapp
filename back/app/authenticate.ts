export const authenticate = <T>(body: (...arg: any[]) => T) => async (_: any, args: any, context: any): Promise<T> => {
  if (!context.authenticated) {
    throw new Error("Not authenticated");
  }

  return body(JSON.parse(JSON.stringify(args)), context.id);
};
