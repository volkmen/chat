import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IsDate, IsEmail, IsInt } from 'class-validator';
import { ChatEntity } from './Chat.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'int' })
  @IsInt()
  email_token: number;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @CreateDateColumn()
  @IsDate()
  updated_at: Date;

  @OneToMany(() => ChatEntity, chat => chat.user)
  chats: ChatEntity[];
}
