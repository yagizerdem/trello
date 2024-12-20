import path from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "~/AppDataSource";
import container from "~/diContainer";
import { User } from "~/entity/user";
import SD from "~/SD";
import FileService from "~/services/fileService";
import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";
import ServiceResponse from "~/util/serviceResponse";

export async function GET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const profileid: string | null = url.searchParams.get("profileid");
    if (profileid == null) {
      throw AppError.create(false, ["profile id is not defined"]);
    }

    const userRepository: Repository<User> = AppDataSource.getRepository(User);
    const userFromDb: User | null = await userRepository.findOneBy({
      id: parseInt(profileid),
    });
    if (userFromDb == null) {
      throw AppError.create(false, [
        `user dont exist with profile id ${profileid}`,
      ]);
    }

    const fileName = userFromDb.profileImageUrl;
    const fileUrl = new URL(
      `src/uploads/profileImages/${fileName}`,
      url.origin
    ).toString();
    return ApiResponse.create(
      true,
      [],
      "profile image fetched from file system",
      fileUrl
    );
  } catch (err) {
    console.log(err);
    var errorMessages: Array<string> = ["internal server error"];
    if (err instanceof AppError) {
      errorMessages = err.errorMessages;
    }
    return ApiResponse.create(false, errorMessages, null, null);
  }
}
