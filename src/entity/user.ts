import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  Matches,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from "class-validator";
import SD from "~/SD";
import { ContactRequest } from "./contactRequest";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    type: "varchar",
    length: 20,
  })
  @IsNotEmpty({ message: "First name is required" }) // Application-level validation
  @MinLength(3)
  @MaxLength(20)
  firstName: string; // Use lowercase 'string'

  @Column({
    nullable: true,
    type: "varchar",
    length: 20,
  })
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty({ message: "Last name is required" }) // Application-level validation
  lastName: string;

  @Column({
    nullable: true,
    type: "varchar",
  })
  @IsEmail()
  email: string;

  @Column({
    nullable: true,
    type: "varchar",
  })
  @Matches(SD.common.strongPasswordRegex, { message: "password too weak" })
  password: string;

  @Column({
    nullable: true,
    type: "varchar",
  })
  profileImageUrl: string;

  // Reverse relation for sent contact requests
  @OneToMany(() => ContactRequest, (contactRequest) => contactRequest.fromuser)
  sentContactRequests!: ContactRequest[];

  // Reverse relation for received contact requests
  @OneToMany(() => ContactRequest, (contactRequest) => contactRequest.destuser)
  receivedContactRequests!: ContactRequest[];

  @CreateDateColumn({
    type: "text", // Use 'text' instead of 'timestamp' for SQLite
    default: () => "CURRENT_TIMESTAMP", // Use CURRENT_TIMESTAMP for SQLite
  })
  createdAt!: Date;
}
