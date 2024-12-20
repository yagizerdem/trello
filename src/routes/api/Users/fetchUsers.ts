import { request } from "http";
import { Repository } from "typeorm";
import url from "url";
import { AppDataSource } from "~/AppDataSource";
import { User } from "~/entity/user";
import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";

interface IQueryObject {
  skip: number | null;
  limit: number | null;
  email: string | null;
  userName: string | null;
  sortBy: string | null;
  userId: Number | null;
}

export async function GET({ request }: { request: Request }) {
  try {
    const params = url.parse(request.url);
    const query = params?.query;
    if (!query) {
      return AppError.create(false, ["should send query for fetching users"]);
    }
    const queryObject: IQueryObject = JSON.parse(
      '{"' +
        decodeURI(query)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
    const userRepository: Repository<User> =
      AppDataSource.getRepository<User>(User);

    let transaction = userRepository
      .createQueryBuilder("user")
      .addSelect("CONCAT(user.firstName, ' ', user.lastName)", "fullName");

    // filter logic
    if (queryObject.email) {
      const normalizedEmail = queryObject.email.trim().toLowerCase();
      transaction = transaction.andWhere("LOWER(user.email) LIKE :email", {
        email: `%${normalizedEmail}%`,
      });
    }
    if (queryObject.userName) {
      transaction = transaction.andWhere(
        "CONCAT(user.firstName, ' ', user.lastName) LIKE :userName",
        {
          userName: `%${queryObject.userName}%`,
        }
      );
    }
    if (queryObject.userId) {
      transaction.andWhere("user.id = :userId", {
        userId: queryObject.userId,
      });
    }
    // pagination
    if (queryObject.skip) {
      transaction.skip(Number(queryObject.skip));
    }
    if (queryObject.limit) {
      transaction.take(Number(queryObject.limit));
    }

    // Create a dummy instance to check properties
    const userInstance = new User();
    if (queryObject.sortBy && queryObject.sortBy in userInstance) {
      transaction.addOrderBy(`user.${queryObject.sortBy}`, "DESC");
    } else {
      transaction.addOrderBy(`user.createdAt`, "DESC");
    }

    const result: Array<User> = await transaction.getMany();
    return ApiResponse.create(true, [], "data successfully fetched", result);
  } catch (err) {
    let message: Array<string> = ["internal server error"];
    if (err instanceof AppError && !err.isCritical) {
      message = err.errorMessages;
    }
    return ApiResponse.create(false, message);
  }
}
