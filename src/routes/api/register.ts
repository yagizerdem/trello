import { validate } from "class-validator";
import { Repository } from "typeorm";
import { AppDataSource } from "~/AppDataSource";
import { User } from "~/entity/user";
import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";
import { generate } from "password-hash";
import container from "~/diContainer";
import SD from "~/SD";
import FileService from "~/services/fileService";
import ServiceResponse from "~/util/serviceResponse";

export async function POST({ request }: { request: Request }) {
  try {
    const formData = await request.formData();

    const newUser: User = new User();
    newUser.firstName = formData.get("firstName") as string;
    newUser.lastName = formData.get("lastName") as string;
    newUser.email = formData.get("email") as string;
    newUser.password = formData.get("password") as string;
    const profileImage = formData.get("profile") as File;

    const userRepository: Repository<User> = AppDataSource.getRepository(User);
    const isValid = await validate(newUser);
    if (isValid.length > 0) {
      throw AppError.create(false, ["invalid user credentials"]);
    }

    const isExist = await userRepository.findOneBy({ email: newUser.email });
    if (isExist) {
      throw AppError.create(false, ["user with this email already registered"]);
    }

    const hash = generate(newUser.password);
    newUser.password = hash;

    // upload file

    const fileUploadService: FileService = container.resolve<FileService>(
      SD.services.fileService
    );

    var serviceResponse: ServiceResponse | null = null;
    if (profileImage) {
      serviceResponse = await fileUploadService.uploadSingleFile(profileImage, [
        "profileImages",
      ]);
    }
    if (serviceResponse && serviceResponse.success) {
      newUser.profileImageUrl = serviceResponse.data.fileName;
    }
    if (serviceResponse && !serviceResponse.success) {
      throw AppError.create(false, serviceResponse.errors);
    }

    console.log("service response", serviceResponse);

    const result = await userRepository.insert(newUser);

    const response: ApiResponse = new ApiResponse();
    response.success = true;
    response.message = "user inserted successfully";

    return response;
  } catch (err) {
    let errors: Array<string> = [];

    if (err instanceof AppError && !err.isCritical) {
      errors = err.errorMessages;
    } else {
      errors = ["internal server error"];
    }

    const response: ApiResponse = new ApiResponse();
    response.success = false;
    response.errors = errors;

    return response;
  }
}
