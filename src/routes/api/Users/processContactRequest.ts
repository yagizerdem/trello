import { getContext, HTTPEvent } from "vinxi/http";
import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";
import jwt from "jsonwebtoken";
import { AppDataSource } from "~/AppDataSource";
import { ContactRequest } from "~/entity/contactRequest";
import { User } from "~/entity/user";
import { QueryBuilder, Repository } from "typeorm";
import ContactRequestStates from "~/enum/contactRequestStates";
const secretKey = process.env["JWTSECRET"] as string;

interface IprocessRequestBody {
  destUserId: number;
  approved: boolean;
}

export async function POST({ request }: { request: Request }) {
  try {
    // @ts-ignore
    const user: User = JSON.parse(request?.["user"]);
    const body: IprocessRequestBody = await request.json();

    // set repositories
    const contactRequestRepository: Repository<ContactRequest> =
      AppDataSource.getRepository<ContactRequest>(ContactRequest);

    const userRepository: Repository<User> =
      AppDataSource.getRepository<User>(User);

    const destUserId = body.destUserId;

    const destUserFromDb = await userRepository.findOneBy({ id: destUserId });

    if (!destUserFromDb) {
      throw AppError.create(false, ["user dont exist ..."]);
    }

    const contactRequestsFromDb: ContactRequest | null =
      await contactRequestRepository.findOneBy({
        fromuserId: user.id,
        destuserId: destUserId,
        requestState: ContactRequestStates.PENDING,
      });

    if (!contactRequestsFromDb) {
      throw AppError.create(false, ["contact request dont exist"]);
    }

    if (body.approved) {
      contactRequestsFromDb.requestState = ContactRequestStates.APPROVED;
    } else {
      contactRequestsFromDb.requestState = ContactRequestStates.REJECTED;
    }
    await contactRequestRepository.save(contactRequestsFromDb);

    console.log(contactRequestsFromDb);

    return ApiResponse.create(
      true,
      [],
      "contact request state updated",
      null,
      true,
      ""
    );
  } catch (err) {
    let message: Array<string> = ["internal server error"];
    if (err instanceof AppError && !err.isCritical) {
      message = err.errorMessages;
    }
    return ApiResponse.create(false, message);
  }
}
