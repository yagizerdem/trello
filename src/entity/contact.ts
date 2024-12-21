import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("contact")
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: "integer",
  })
  user1id: number;

  @Column({
    nullable: false,
    type: "integer",
  })
  user2id: number;

  @CreateDateColumn({
    type: "text", // Use 'text' instead of 'timestamp' for SQLite
    default: () => "CURRENT_TIMESTAMP", // Use CURRENT_TIMESTAMP for SQLite
  })
  createdAt!: Date;
}
