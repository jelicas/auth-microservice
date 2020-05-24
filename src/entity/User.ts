import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  public password: string;

  @Column({ name: "full_name" })
  public fullName: string;

  constructor(
    email: string,
    password: string,
    fullName: string,
  ) {
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
