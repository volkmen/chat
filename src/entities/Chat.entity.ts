import { Entity, PrimaryGeneratedColumn, ManyToMany, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IsDate } from 'class-validator';
import { Expose } from 'class-transformer';
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
  @Expose({ name: 'createdAt' })
  created_at: Date;

  @CreateDateColumn()
  @IsDate()
  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @OneToMany(() => MessageEntity, message => message.chat, { onDelete: 'CASCADE' })
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity)
  users: UserEntity[];
}
