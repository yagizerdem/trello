import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";
import { AppDataSource } from "~/AppDataSource";
import { ContactRequest } from "~/entity/contactRequest";
import { User } from "~/entity/user";
import { QueryBuilder, Repository } from "typeorm";
import ContactRequestStates from "~/enum/contactRequestStates";
import { Contact } from "~/entity/contact";

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
        fromuserId: destUserId,
        destuserId: user.id,
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

    // create contact
    if (body.approved) {
      const contactRepository: Repository<Contact> =
        AppDataSource.getRepository<Contact>(Contact);

      const contact1: Contact = new Contact();
      contact1.user1id = user.id;
      contact1.user2id = destUserId;

      const contact2: Contact = new Contact();
      contact2.user1id = destUserId;
      contact2.user2id = user.id;

      await contactRepository.insert(contact1);
      await contactRepository.insert(contact2);
    }

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
