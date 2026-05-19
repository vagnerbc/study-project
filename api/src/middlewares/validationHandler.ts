import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type ValidationRequestType = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validationHandler = (schema: ValidationRequestType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params) as any;
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query) as any;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
