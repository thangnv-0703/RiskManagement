import { Schema } from 'mongoose';

export const sharedSchema = (
  timestamp: boolean = true,
  minimize: boolean = false
): Schema => {
  return new Schema(
    {},
    {
      timestamps: timestamp,
      toObject: {
        transform: function (doc, ret) {
          ret.id = ret._id?.toString();
          delete ret._id;
          return ret;
        },
      },
      toJSON: {
        transform: function (doc, ret) {
          ret.id = ret._id?.toString();
          delete ret._id;
          return ret;
        },
      },
      minimize: minimize,
      optimisticConcurrency: true,
      strict: false,
    }
  );
};
