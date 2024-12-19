import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";
import { Repository } from "typeorm";
import { AppDataSource } from "~/AppDataSource";
import { User } from "~/entity/user";
import LogInDTO from "~/DTO/logInDTO";
import { verify } from "password-hash";
import jwtController from "~/util/jwtController";

export async function POST({ request }: { request: Request }) {
  try {
    const userRepository: Repository<User> = AppDataSource.getRepository(User);
    const body: LogInDTO = (await request.json()) as LogInDTO;

    const userFromDb = await userRepository.findOneBy({ email: body.email });

    if (userFromDb == null) {
      throw AppError.create(false, [`user with email ${body.email} not found`]);
    }

    const isPasswordMatch = verify(body.password, userFromDb?.password);
    if (!isPasswordMatch) {
      throw AppError.create(false, [`password dont match`]);
    }

    // generate jwt
    const jwtcontroller: jwtController = jwtController.getInstance();

    const jwtPayload = {
      firstName: userFromDb.firstName,
      lastName: userFromDb.lastName,
      email: userFromDb.email,
      id: userFromDb.id,
    };

    const token = jwtcontroller.generateToken(jwtPayload);

    const response: ApiResponse = new ApiResponse();
    response.success = true;
    response.message = "user logged in successfully";
    response.data = token;

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
