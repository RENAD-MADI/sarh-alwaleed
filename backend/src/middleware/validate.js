import ApiError from '../utils/ApiError.js';

/**
 * Validates `req[source]` against a zod schema and replaces it with the parsed
 * result, so controllers only ever see values that passed validation.
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        errors[issue.path.join('.') || '_'] = issue.message;
      }
      return next(ApiError.badRequest('Validation failed', errors));
    }
    req[source] = result.data;
    next();
  };
}

export default validate;
