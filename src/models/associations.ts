/**
 * @fileoverview
 * @module
 * @version
 */
import { Admin } from './adminModel';
import { User } from './userModel';

const models = {
  Admin,
  User,
};

const associateModels = () => {
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
};

export { associateModels, models };
