/**
 * Updates fields on a model with non-undefined values from a fields object.
 * @param {Object} model - The Mongoose model instance to update (e.g., product).
 * @param {Object} fields - Object containing field-value pairs to update.
 */
export const updateModelFields = (model, fields) => {
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) {
      model[key] = value;
    }
  });
};