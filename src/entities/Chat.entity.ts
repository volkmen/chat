import { Entity, PrimaryGeneratedColumn, ManyToMany, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IsDate } from 'class-validator';
import { MessageEntity } from './Message.entity';
import { UserEntity } from './User.entity';

@Entity({ name: 'Chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  is_group: boolean;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @CreateDateColumn()
  @IsDate()
  updated_at: Date;

  @OneToMany(() => MessageEntity, message => message.chat, { onDelete: 'CASCADE' })
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity)
  users: UserEntity[];
}
