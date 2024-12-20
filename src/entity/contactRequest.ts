import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";
import ContactRequestStates from "~/enum/contactRequestStates";

@Entity("contactrequests")
export class ContactRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentContactRequests, {
    nullable: false,
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "fromuserId" }) // Optional: explicitly define the foreign key column name
  fromuser!: User;

  @Column({ type: "number" })
  fromuserId!: number; // Foreign key column

  @ManyToOne(() => User, (user) => user.receivedContactRequests, {
    nullable: false,
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "destuserId" }) // Optional: explicitly define the foreign key column name
  destuser!: User;

  @Column({ type: "number" })
  destuserId!: number; // Foreign key column

  @CreateDateColumn({
    type: "text", // Use 'text' instead of 'timestamp' for SQLite
    default: () => "CURRENT_TIMESTAMP", // Use CURRENT_TIMESTAMP for SQLite
  })
  createdAt!: Date;

  @Column({
    type: "text", // Use "text" instead of "enum" for SQLite
    default: ContactRequestStates.PENDING, // Set a default value
  })
  requestState!: ContactRequestStates;
}
