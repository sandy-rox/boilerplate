import { Request } from 'express';

export interface GuardedRequest extends Request {
  user?: any; // Custom field to store user data (e.g., after authentication)
  body: any; // The body of the request, can be encrypted in production
  params: { [key: string]: string }; // The route parameters
  query: { [key: string]: string | string[] }; // Query string parameters
}
