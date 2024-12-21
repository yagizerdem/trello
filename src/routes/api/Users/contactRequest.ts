import ApiResponse from "~/util/apiResponse";
import AppError from "~/util/appError";
import { AppDataSource } from "~/AppDataSource";
import { ContactRequest } from "~/entity/contactRequest";
import { User } from "~/entity/user";
import { QueryBuilder, Repository } from "typeorm";
import ContactRequestStates from "~/enum/contactRequestStates";
import { Contact } from "~/entity/contact";

interface IContactRequestBody {
  destUserId: number;
}

export async function POST({ request }: { request: Request }) {
  try {
    // @ts-ignore
    const user: User = JSON.parse(request?.["user"]);
    const body: IContactRequestBody = await request.json();

    const contactRequestRepository: Repository<ContactRequest> =
      AppDataSource.getRepository<ContactRequest>(ContactRequest);

    const userRepository: Repository<User> =
      AppDataSource.getRepository<User>(User);

    const contactRepository: Repository<Contact> =
      AppDataSource.getRepository<Contact>(Contact);

    const destUserFromDb: User | null = await userRepository.findOneBy({
      id: body.destUserId,
    });
    if (body.destUserId == user.id) {
      throw AppError.create(false, [
        `cant send conotact request to own profile`,
      ]);
    }

    if (!destUserFromDb) {
      throw AppError.create(false, [
        `user with id ${body.destUserId} dont exist`,
      ]);
    }

    // check request is alredy sent or not

    const flag: boolean = Boolean(
      await contactRequestRepository.findOneBy({
        fromuserId: user.id,
        destuserId: destUserFromDb.id,
      })
    );

    if (flag) {
      throw AppError.create(false, [`already send contact request`]);
    }

    // check user is already in contact
    const contactFromdb: Contact | null = await contactRepository.findOneBy({
      user1id: user.id,
      user2id: destUserFromDb.id,
    });
    if (contactFromdb) {
      throw AppError.create(false, [`already in contact`]);
    }

    const newContactRequest: ContactRequest = new ContactRequest();
    newContactRequest.fromuser = user;
    newContactRequest.destuser = destUserFromDb;
    newContactRequest.fromuserId = user.id;
    newContactRequest.destuser.id = destUserFromDb.id;
    newContactRequest.requestState = ContactRequestStates.PENDING;

    const result = await contactRequestRepository.insert(newContactRequest);

    return ApiResponse.create(
      true,
      [],
      "request send successfuly",
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

export async function GET({ request }: { request: Request }) {
  try {
    // @ts-ignore
    const user: User = JSON.parse(request?.["user"]);

    const contactRequestRepository: Repository<ContactRequest> =
      AppDataSource.getRepository<ContactRequest>(ContactRequest);

    const contactRequestFromdb: Array<ContactRequest> =
      await contactRequestRepository.findBy({
        destuserId: user.id,
        requestState: ContactRequestStates.PENDING,
      });

    const filteredResponse: any = [];
    contactRequestFromdb.forEach((item) => {
      const record = {};
      const fromUser: User = item.fromuser;
      Object.assign(record, {
        ...fromUser,
        password: null,
        createdAt: item.createdAt,
      });
      Object.keys(record);
      // remove keys wiht null values
      const cleanObject = Object.fromEntries(
        Object.entries(record).filter(([_, v]) => v !== null)
      );
      filteredResponse.push(cleanObject);
    });

    return ApiResponse.create(
      true,
      [],
      "contact request fetched",
      filteredResponse
    );
  } catch (err) {
    let message: Array<string> = ["internal server error"];
    if (err instanceof AppError && !err.isCritical) {
      message = err.errorMessages;
    }
    return ApiResponse.create(false, message);
  }
}
