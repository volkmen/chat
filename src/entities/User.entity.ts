import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { IsDate, IsEmail, IsInt } from 'class-validator';
import { ChatEntity } from './Chat.entity';
import { MessageEntity } from './Message.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'Users' })
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
  @Expose({ name: 'createdAt' }) // Transform field name
  created_at: Date;

  @CreateDateColumn()
  @IsDate()
  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @OneToMany(() => MessageEntity, msg => msg.owner)
  messages: MessageEntity[];

  @ManyToMany(() => ChatEntity)
  @JoinTable({
    name: 'UsersChats'
  })
  chats: ChatEntity[];
}
