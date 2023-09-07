import mongoose, { Model, UpdateQuery } from 'mongoose';
import { BaseDocument } from './base.document';
import { BaseRepositoryPort } from '@libs/common/base';
import { PagingParam, PagingResponse } from '@libs/api-contract';

export class BaseRepository<T extends BaseDocument>
  implements BaseRepositoryPort<T>
{
  constructor(readonly collection: Model<T>) {}

  /**
   * This function finds and returns a subset of documents from a MongoDB collection based on a given
   * filter and pagination parameters.
   * @param {PagingParam} param - PagingParam object that contains the skip, limit, and filter
   * parameters for pagination and filtering of data.
   * @returns A Promise that resolves to a PagingResponse object containing an array of data and the
   * total count of documents that meet the query criteria.
   */
  async findAll(filter: object): Promise<T[]> {
    return this.collection.find(filter);
  }

  /**
   * This function finds and returns a subset of documents from a MongoDB collection based on a given
   * filter and pagination parameters.
   * @param {PagingParam} param - PagingParam object that contains the skip, limit, and filter
   * parameters for pagination and filtering of data.
   * @returns A Promise that resolves to a PagingResponse object containing an array of data and the
   * total count of documents that meet the query criteria.
   */
  async findAllPaging(param: PagingParam): Promise<PagingResponse<T>> {
    const skip = param?.skip || 0;
    const limit = param?.limit || 10;
    const filter = param?.filter || {};
    const pipeline = [
      // Stage 1: Match documents that meet your query criteria
      {
        $match: filter,
      },
      // Stage 2: Group documents and calculate the total count
      {
        $facet: {
          data: [{ $skip: skip || 0 }, { $limit: limit }],
          count: [{ $count: 'total' }],
        },
      },
    ];

    const results = await this.collection.aggregate(pipeline).exec();
    const data = (results[0].data as T[]).map((item) => {
      item.id = item._id.toString();
      delete item._id;
      item.createdAt = new Date(item.createdAt);
      item.updatedAt = new Date(item.updatedAt);
      return item;
    });
    const count = results[0].count[0]?.total || 0;
    return {
      data,
      total: count,
    };
  }

  /**
   * This is an asynchronous function that finds and returns an array of objects based on a given
   * condition.
   * @param {object} condition - The `condition` parameter is an object that specifies the criteria for
   * selecting documents from the MongoDB collection. It is used as a filter to match documents that
   * meet the specified conditions. The `findByCondition` method returns an array of documents that
   * match the specified condition.
   * @returns A promise that resolves to an array of objects of type T that match the given condition.
   * The objects are retrieved from the collection using the `find` method and then executed using the
   * `exec` method.
   */
  async findByCondition(condition: object): Promise<T[]> {
    return this.collection.find(condition).exec();
  }

  /**
   * This function asynchronously finds a document in a collection by its ID and returns it as a
   * nullable Promise.
   * @param {string} id - The `id` parameter is a string representing the unique identifier of the
   * document to be retrieved from the database.
   * @returns The `findById` method is returning a Promise that resolves to a nullable instance of type
   * `T`. The method is using the `await` keyword to wait for the Promise returned by
   * `this.collection.findById(id)` to resolve before returning its value.
   */
  async findById(id: string): Promise<T> {
    const result = await this.collection.findById(id);
    return result;
  }

  /**
   * This function inserts a single document into a collection and returns its ID as a string.
   * @param {T} data - The `data` parameter is of type `T`, which is a generic type that represents the
   * type of data being inserted into the database. It is an object that contains the data to be
   * inserted.
   * @returns A string representation of the ID of the inserted document.
   */
  async insertOne(data: T): Promise<string> {
    const result = await this.collection.create<T>({
      _id: data.id,
      ...data,
    });
    return result.id.toString();
  }

  /**
   * This function inserts multiple data objects into a collection and returns an array of their IDs.
   * @param {T[]} data - An array of objects of type T that are to be inserted into the database.
   * @returns The function `insertMany` returns a Promise that resolves to an array of strings, which are
   * the IDs of the documents that were inserted into the collection.
   */
  async insertMany(data: T[]): Promise<string[]> {
    const result = await this.collection.insertMany<T>(data);
    return result.map((doc) => doc.id);
  }

  /**
   * This is an asynchronous function that updates a document in a MongoDB collection based on its ID
   * and returns the updated document.
   * @param {T} data - The data object that needs to be updated in the MongoDB collection.
   * @returns The `updateById` function is returning a Promise that resolves to a nullable `T` (generic
   * type). The function updates a document in the MongoDB collection using the `findByIdAndUpdate`
   * method and returns the updated document. If the document is not found, the function returns
   * `null`.
   */
  async updateById(id: string, data: Partial<T>): Promise<T> {
    delete data.__v;
    const result = await this.collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...(data as unknown as UpdateQuery<T>),
        $inc: { __v: 1 },
      },
      {
        new: true,
      }
    );
    return result;
  }

  /**
   * This is an async function that updates multiple documents in a MongoDB collection based on a given
   * condition and returns a boolean indicating whether any documents were matched and updated.
   * @param {object} condition - The condition parameter is an object that specifies the criteria for
   * selecting the documents to update. It is used to filter the documents in the collection that match
   * the specified condition.
   * @param {T} data - The `data` parameter is of type `T`, which means it can be any object that
   * matches the schema of the collection being updated. It contains the new values that will be set
   * for the matching documents in the collection.
   * @returns A boolean value indicating whether the update operation was successful or not.
   */
  async updateMany(condition: object, data: Partial<T>): Promise<boolean> {
    delete data.__v;
    const result = await this.collection.updateMany(condition, {
      ...(data as unknown as UpdateQuery<T>),
      $inc: { __v: 1 },
    });
    return result.matchedCount > 0;
  }

  /**
   * The `upsert` function updates or inserts a document in a collection based on a condition and
   * returns a boolean indicating if the document was modified.
   * @param {object} condition - The `condition` parameter is an object that specifies the criteria for
   * selecting the document(s) to update. It is used to find the document(s) that match the specified
   * condition.
   * @param data - The `data` parameter is an object that contains the partial data that needs to be
   * updated or inserted into the collection. It is of type `Partial<T>`, which means it contains a
   * subset of properties from the `T` type.
   * @returns a Promise that resolves to a boolean value.
   */
  async upsert(condition: object, data: Partial<T>): Promise<boolean> {
    delete data.__v;
    const result = await this.collection.findOneAndUpdate(
      condition,
      {
        ...(data as unknown as UpdateQuery<T>),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    return result !== null;
  }

  /**
   * This function deletes a document from a MongoDB collection by its ID and returns a boolean
   * indicating whether the deletion was successful.
   * @param {string} id - The id parameter is a string representing the unique identifier of the
   * document to be deleted from the MongoDB collection.
   * @returns A boolean value indicating whether the document with the specified ID was successfully
   * deleted or not.
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await this.collection.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
    return result !== null;
  }

  /**
   * This function deletes multiple documents from a collection based on a given condition and returns
   * a boolean indicating whether any documents were deleted.
   * @param {object} condition - The `condition` parameter is an object that specifies the criteria for
   * selecting the documents to be deleted from the collection. It can contain one or more key-value
   * pairs that represent the fields and their corresponding values that the documents must match in
   * order to be deleted. For example, `{ name: "John",
   * @returns A Promise that resolves to a boolean value indicating whether or not any documents were
   * deleted based on the provided condition.
   */
  async deleteMany(condition: object): Promise<boolean> {
    const result = await this.collection.deleteMany(condition);
    return result.deletedCount > 0;
  }
}
