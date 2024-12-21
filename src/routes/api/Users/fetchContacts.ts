import { request } from "http";
import { Repository } from "typeorm";
import url from "url";
import { AppDataSource } from "~/AppDataSource";
import { Contact } from "~/entity/contact";
import { User } from "~/entity/user";
import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";

export async function GET({ request }: { request: Request }) {
  try {
    // @ts-ignore
    const user: User = JSON.parse(request?.["user"]);

    const userRepository: Repository<User> =
      AppDataSource.getRepository<User>(User);

    const contacts = (
      await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("contact", "contact", "user.id = contact.user1id")
        .where("contact.user2id = :user2id", { user2id: user.id })
        .getMany()
    ).map((item) => {
      // Remove `password` and filter out null fields
      const sanitizedItem = Object.fromEntries(
        Object.entries({ ...item, password: null }).filter(
          ([_, v]) => v !== null
        )
      );
      return sanitizedItem;
    });

    return ApiResponse.create(true, [], "data successfully fetched", contacts);
  } catch (err) {
    let message: Array<string> = ["internal server error"];
    if (err instanceof AppError && !err.isCritical) {
      message = err.errorMessages;
    }
    return ApiResponse.create(false, message);
  }
}
